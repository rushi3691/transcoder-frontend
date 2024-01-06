import { prisma } from "@/prisma/db";
import Player from "./player";
import VideoInfo from "./VideoInfo";



export default async function WatchPage({ params }: { params: { id: string } }) {
    const data = await getVideoData(params.id);

    if (!data) return <div>Video not found</div>

    return (
        <div className='ml-56 mt-10 flex flex-col w-[65%] gap-6'>
            <Player video={data} />
            <VideoInfo video={data} />
        </div>
    )
}


async function getVideoData(id: string) {
    try {
        const data = await prisma.video.findUnique({
            where: { id }
        });
        return data;
    } catch (err) {
        console.log('err', err);
        return null;
    }
}

