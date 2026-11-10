import { prisma } from '@/prisma/db';
import VideoCard from '@/components/custom-components/video-card';


export default async function ListVideos() {

    const videos = await getVideos();

    if (videos.length === 0) {
        return <p className="col-span-full py-20 text-center text-muted-foreground">No videos yet.</p>;
    }

    return (
        <>
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </>
    );
}


async function getVideos() {
    const data = await prisma.video.findMany({
        where: {
            status: "READY"
        },
        include: {
            user: { select: { name: true, image: true } },
        },
        orderBy: [
            { createdAt: 'desc' },
        ],
        take: 10,
    })
    return data;
}
