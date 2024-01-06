import { prisma } from '@/prisma/db';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


const cloudfrontUrl = 'https://d3tc1biq9ly8l.cloudfront.net/processed/';


export default async function Home() {

  const videos = await getVideos();
  const temp = [...videos, ...videos, ...videos, ...videos, ...videos, ...videos, ...videos, ...videos];

  return (
    // handle overflow in y axis
    <div className="ml-60 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 m-10">
      {temp.map((video) => (
        <div key={video.id} className="rounded shadow-lg">
          <Link href={`/watch/${video.id}`}>
            <div className='h-full w-full'>
              <Image
                src={cloudfrontUrl + `${video.id}/thumb_1080p.jpg`}
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
    </div >
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