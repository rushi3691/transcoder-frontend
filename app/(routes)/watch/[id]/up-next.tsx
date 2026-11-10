import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/prisma/db";
import { MEDIA_URL } from "@/lib/media";
import { formatDuration, timeAgo } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/** Right-hand column: other ready videos, newest first (no recommendation logic). */
export default async function UpNext({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const videos = await prisma.video.findMany({
        where: { status: "READY", NOT: { id } },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
    });

    if (videos.length === 0) {
        return <p className="py-4 text-sm text-muted-foreground">No other videos yet.</p>;
    }

    return (
        <ul className="flex flex-col gap-2">
            {videos.map((video) => (
                <li key={video.id}>
                    <Link href={`/watch/${video.id}`} className="flex gap-2 rounded-lg">
                        <div className="relative aspect-video w-[168px] shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                                src={MEDIA_URL + `${video.id}/thumb_1080p.jpg`}
                                alt={video.title}
                                fill
                                sizes="168px"
                                className="object-cover"
                            />
                            {video.duration != null && (
                                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs font-medium text-white">
                                    {formatDuration(video.duration)}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0 pr-2">
                            <h3 className="line-clamp-2 text-sm font-medium leading-5">{video.title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">{video.user.name}</p>
                            <p className="text-xs text-muted-foreground">{timeAgo(video.createdAt)}</p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export function UpNextSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                    <Skeleton className="aspect-video w-[168px] shrink-0 rounded-lg" />
                    <div className="flex w-full flex-col gap-2 pt-1">
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );
}
