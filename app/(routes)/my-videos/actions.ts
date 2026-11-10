"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/db";
import { canUpload } from "@/lib/access";
import { VideoDetailsSchema } from "@/validators/VideoValidator";

export type EditVideoState = { ok?: boolean; error?: string };

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
