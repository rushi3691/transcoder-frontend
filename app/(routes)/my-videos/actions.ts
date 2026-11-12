"use server";

import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/db";
import { canUpload } from "@/lib/access";
import { VideoDetailsSchema } from "@/validators/VideoValidator";
import { r2client, R2_BUCKET } from "@/r2";

export type EditVideoState = { ok?: boolean; error?: string };
export type DeleteVideoState = { ok?: boolean; error?: string };

/** Update a video's title and description. Only the signed-in owner (on the uploader allow-list) can edit. */
export async function updateVideoDetails(_prev: EditVideoState, formData: FormData): Promise<EditVideoState> {
    const session = await getServerSession(authOptions);
    if (!session || !canUpload(session.user.email)) {
        return { error: "You are not allowed to edit videos." };
    }

    const parsed = VideoDetailsSchema.safeParse({
        vid: formData.get("vid"),
        title: formData.get("title"),
        description: formData.get("description") ?? "",
    });
    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }
    const { vid, title, description } = parsed.data;

    // updateMany scoped to userId: someone else's video id matches nothing instead of throwing
    const { count } = await prisma.video.updateMany({
        where: { id: vid, userId: session.user.id },
        data: { title, description },
    });
    if (count === 0) {
        return { error: "Video not found." };
    }

    // pages that show the title/description
    revalidatePath("/my-videos");
    revalidatePath("/");
    revalidatePath(`/watch/${vid}`);
    return { ok: true };
}

/**
 * Permanently delete a video: its upload (raw/<id>), every processed file (processed/<id>/...) in R2,
 * then its database record. Files go first so a failure leaves the record for a retry; retries are safe.
 */
export async function deleteVideo(_prev: DeleteVideoState, formData: FormData): Promise<DeleteVideoState> {
    const session = await getServerSession(authOptions);
    if (!session || !canUpload(session.user.email)) {
        return { error: "You are not allowed to delete videos." };
    }

    const vid = formData.get("vid");
    if (typeof vid !== "string" || !vid) {
        return { error: "Missing video id." };
    }

    const video = await prisma.video.findFirst({ where: { id: vid, userId: session.user.id }, select: { status: true } });
    if (!video) {
        return { error: "Video not found." };
    }
    // the worker may still upload processed files for these; deleting now would leave orphans in R2
    if (video.status === "PENDING" || video.status === "PROCESSING") {
        return { error: "This video is still processing. Try again once it has finished." };
    }

    try {
        await deleteVideoFiles(vid);
    } catch (e) {
        console.error("deleteVideo: R2 cleanup failed", vid, e);
        return { error: "Couldn't delete the video's files. Nothing was removed; please try again." };
    }

    await prisma.video.deleteMany({ where: { id: vid, userId: session.user.id } });

    revalidatePath("/my-videos");
    revalidatePath("/");
    revalidatePath(`/watch/${vid}`);
    return { ok: true };
}

async function deleteVideoFiles(vid: string) {
    const keys = [`raw/${vid}`];
    let ContinuationToken: string | undefined;
    do {
        const page = await r2client.send(
            new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: `processed/${vid}/`, ContinuationToken })
        );
        keys.push(...(page.Contents ?? []).flatMap((o) => (o.Key ? [o.Key] : [])));
        ContinuationToken = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (ContinuationToken);

    // DeleteObjects takes at most 1000 keys per request; missing keys are not an error
    for (let i = 0; i < keys.length; i += 1000) {
        const res = await r2client.send(
            new DeleteObjectsCommand({
                Bucket: R2_BUCKET,
                Delete: { Objects: keys.slice(i, i + 1000).map((Key) => ({ Key })), Quiet: true },
            })
        );
        if (res.Errors?.length) {
            throw new Error(`R2 refused ${res.Errors.length} deletes, first: ${res.Errors[0].Key} ${res.Errors[0].Code}`);
        }
    }
}
