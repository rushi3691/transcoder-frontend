import { Suspense } from "react";
import { prisma } from "@/prisma/db";
import { Skeleton } from "@/components/ui/skeleton";
import Player from "./player";
import VideoInfo from "./VideoInfo";


/** Shell prerenders; the video lookup streams in. */
export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        // width capped so the 16:9 player leaves room for the title on short screens
        <div className='mx-auto flex max-w-[min(1280px,calc((100vh-220px)*16/9+48px))] flex-col gap-3 px-4 py-6 sm:px-6'>
            <Suspense fallback={<WatchSkeleton />}>
                <Watch params={params} />
            </Suspense>
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
