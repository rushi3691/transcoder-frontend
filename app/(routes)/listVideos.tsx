import { prisma } from '@/prisma/db';
import Image from 'next/image';
import Link from 'next/link';


import { MEDIA_URL } from '@/lib/media';


export default async function ListVideos() {

    const videos = await getVideos();

    return (
        <>
            {videos.map((video) => (
                <div key={video.id} className="rounded">
                    <Link href={`/watch/${video.id}`}>
                        <div className='h-full w-full'>
                            <Image
                                src={MEDIA_URL + `${video.id}/thumb_1080p.jpg`}
                                width={360} height={200}
                                alt={video.title || 'Loading...'}
                                className="rounded-2xl w-full"
                            />
                            <div className="px-1 py-4">
                                <div className="font-bold text-xl mb-2">{video.title}</div>
                                <p className="text-gray-400 text-sm text-wrap">{video.description?.substring(0, 100)}...</p>
                                <p className="text-gray-400 text-sm ">{video.createdAt.toLocaleDateString()}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))
            }
        </>
    );
}


async function getVideos() {
    // const session = await getServerSession(authOptions);

    const data = await prisma.video.findMany({
        where: {
            status: "READY"
        },
        orderBy: [
            { createdAt: 'desc' },
            // { status: 'desc' },
        ],
        take: 10,
    })
    return data;
}