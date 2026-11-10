import { Suspense } from "react";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { Film } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { MEDIA_URL } from "@/lib/media";
import { cn } from "@/lib/utils";
import { canUpload } from "@/lib/access";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLES: Record<string, string> = {
    READY: "bg-green-500/15 text-green-400",
    PENDING: "bg-amber-500/15 text-amber-400",
    PROCESSING: "bg-amber-500/15 text-amber-400",
    FAILED: "bg-red-500/15 text-red-400",
};

/** Shell (heading + table header) renders immediately; rows stream in once the session and query resolve. */
export default function MyVideos() {
    return (
        <div className="px-4 py-6 sm:px-6">
            <h1 className="mb-6 text-2xl font-semibold">Your videos</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Video</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <Suspense fallback={<RowsSkeleton />}>
                        <VideoRows />
                    </Suspense>
                </TableBody>
            </Table>
        </div>
    )
}

function RowsSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <div className="flex items-start gap-4">
                            <Skeleton className="aspect-video w-32 shrink-0 rounded-md" />
                            <div className="flex w-full flex-col gap-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="ml-auto h-4 w-24" /></TableCell>
                </TableRow>
            ))}
        </>
    )
}

async function VideoRows() {
    const data = await getVideos();

    if (data.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={3} className="py-20 text-center text-muted-foreground">
                    You haven&apos;t uploaded any videos yet.
                </TableCell>
            </TableRow>
        );
    }

    return (
        <>
            {data.map((video) => {
                const ready = video.status === "READY";
                return (
                    <TableRow key={video.id}>
                        <TableCell>
                            <div className="flex items-start gap-4">
                                <div className="relative flex aspect-video w-32 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                                    {ready ? (
                                        <Image
                                            src={MEDIA_URL + `${video.id}/thumb_1080p.jpg`}
                                            alt={video.title}
                                            fill
                                            sizes="128px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Film className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    {ready ? (
                                        <Link href={`/watch/${video.id}`} className="line-clamp-1 font-medium hover:underline">
                                            {video.title}
                                        </Link>
                                    ) : (
                                        <p className="line-clamp-1 font-medium">{video.title}</p>
                                    )}
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                        {video.description || "No description"}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLES[video.status] ?? "bg-muted")}>
                                {video.status.charAt(0) + video.status.slice(1).toLowerCase()}
                            </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-right text-sm">
                            {video.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            <p className="text-xs text-muted-foreground">Uploaded</p>
                        </TableCell>
                    </TableRow>
                );
            })}
        </>
    )
}


async function getVideos() {
    // per-request: next-auth v4 generates a random CSRF token, which can't be prerendered
    await connection();
    const session = await getServerSession(authOptions);

    if (!session || !canUpload(session.user.email)) {
        return [];
    }
    const data = await prisma.video.findMany({
        where: {
            userId: session.user.id,
            NOT: [
                { status: "DELETED" },
                { status: "UNUPLOADED" }
            ],
        },
        orderBy: [
            { createdAt: 'desc' },
        ]
    })
    return data;
}
