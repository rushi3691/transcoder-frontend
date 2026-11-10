import Image from "next/image";
import Link from "next/link";
import { Video } from "@prisma/client";
import { MEDIA_URL } from "@/lib/media";
import { timeAgo } from "@/lib/utils";
import Avatar from "./avatar";

export type VideoWithUser = Video & { user: { name: string | null; image: string | null } };

/** Home grid card: 16:9 thumbnail, then uploader avatar, title, uploader name and age. */
export default function VideoCard({ video }: { video: VideoWithUser }) {
    return (
        <Link href={`/watch/${video.id}`} className="flex flex-col gap-3">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <Image
                    src={MEDIA_URL + `${video.id}/thumb_1080p.jpg`}
                    alt={video.title}
                    fill
                    sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                />
            </div>
            <div className="flex gap-3 pr-6">
                <Avatar name={video.user.name} image={video.user.image} />
                <div className="min-w-0">
                    <h3 className="line-clamp-2 text-base font-medium leading-[22px]">{video.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{video.user.name}</p>
                    <p className="text-sm text-muted-foreground">{timeAgo(video.createdAt)}</p>
                </div>
            </div>
        </Link>
    );
}
