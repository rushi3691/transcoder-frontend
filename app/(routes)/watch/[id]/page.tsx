import { Suspense } from "react";
import { prisma } from "@/prisma/db";
import { Skeleton } from "@/components/ui/skeleton";
import Player from "./player";
import VideoInfo from "./VideoInfo";
import UpNext, { UpNextSkeleton } from "./up-next";


/** Shell prerenders; the video and the up-next list stream in independently. */
export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        // two columns from xl (player + details | up next), stacked below
        <div className='mx-auto flex max-w-[1754px] flex-col gap-6 px-4 py-6 sm:px-6 xl:flex-row'>
            <div className='flex min-w-0 flex-1 flex-col gap-3'>
                <Suspense fallback={<WatchSkeleton />}>
                    <Watch params={params} />
                </Suspense>
            </div>
            <aside className='w-full shrink-0 xl:w-[402px]'>
                <Suspense fallback={<UpNextSkeleton />}>
                    <UpNext params={params} />
                </Suspense>
            </aside>
        </div>
    )
}

async function Watch({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getVideoData(id);

    if (!data) return <div className="py-20 text-center text-muted-foreground">Video not found</div>

    return (
        <>
            <Player video={data} />
            <VideoInfo video={data} />
        </>
    )
}

function WatchSkeleton() {
    return (
        <>
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-7 w-2/3" />
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
        </>
    )
}


async function getVideoData(id: string) {
    try {
        const data = await prisma.video.findUnique({
            where: { id },
            include: { user: { select: { name: true, image: true } } },
        });
        return data;
    } catch (err) {
        console.log('err', err);
        return null;
    }
}
