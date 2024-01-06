

// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import VideoSearchCard from "@/components/custom-components/videosearch-card";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";


type VideoData = {
    id: string;
    status: "UNUPLOADED" | "READY" | "PROCESSING" | "FAILED";
    title: string;
    description: string | null;
    url: string | null;
    thumbnail: string | null;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    userId: string;
}

export default async function MyVideos() {

    const data = await getVideos();


    // sort data by status such that the videos that are ready are at the top

    return (
        // <div className="w-full flex flex-col items-center gap-5 p-5 pb-10 h-full overflow-y-scroll custom-scrollbar">
        <div className="ml-56 w-full">

            <Table>
                <TableCaption>A list of your vidoes.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Title</TableHead>
                        <TableHead className="w-[40%]">Description</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Video URL</TableHead>
                        <TableHead className="text-right">CreatedAt</TableHead>
                        {/* <TableHead className="text-right">PublishedAt</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell className="font-medium">{video.title}</TableCell>
                            <TableCell>{getDescription(video.description!)}</TableCell>
                            <TableCell className="text-center">{video.status}</TableCell>
                            <TableHead className="text-center">
                                {video.status === "READY" ? (
                                    <Link href={`/watch/${video.id}`}>{`/watch/${video.id}`}</Link>
                                ) : null}
                            </TableHead>
                            <TableCell className="text-right">{video.createdAt.toString()}</TableCell>
                        </TableRow>
                    ))}
                    {data?.map((video) => (
                        <TableRow key={video.id}>
                            <TableCell className="font-medium">{video.title}</TableCell>
                            <TableCell>{getDescription(video.description!)}</TableCell>
                            <TableCell className="text-center">{video.status}</TableCell>
                            <TableHead className="text-center">
                                {video.status === "READY" ? (
                                    <Link href={`/watch/${video.id}`}>{`/watch/${video.id}`}</Link>
                                ) : null}
                            </TableHead>
                            <TableCell className="text-right">{video.createdAt.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


function getDescription(description: string) {
    const descriptionWithHashtags = description?.split('\n').map((line, lineIdx) => {
        if (line.trim() === '') {
            return <br key={lineIdx} />;
        } else {
            return (
                <p key={lineIdx}>
                    {line.split(' ').map((word, wordIdx) => {
                        if (word.startsWith('#')) {
                            return <span key={wordIdx} className='text-blue-500'>{word}</span>;
                        } else {
                            return word;
                        }
                    }).reduce((prev, curr, i) => {
                        return <>{prev} {(i !== 0) && ' '}{curr}</>;
                    }, <></>)}
                </p>
            );
        }
    });
    return descriptionWithHashtags;
}


async function getVideos() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return null;
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
            // { status: 'desc' },
        ]
    })
    return data;
}