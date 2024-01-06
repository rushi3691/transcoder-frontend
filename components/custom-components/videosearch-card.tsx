import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Link from "next/link";

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Video } from "@prisma/client";



export default async function VideoSearchCard(video: Video) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return (
            <div>Unauthenticated</div>
        )
    }

    return (
        <Link href={`/watch/${video.id}`} className="w-1/2">
            <Card className="flex p-2 text-white bg-black">
                <Image src="https://placehold.co/360x200" width={360} height={200} alt="placeholder" />
                <div className="flex flex-col w-full">
                    <CardHeader className="text-xl text">
                        Iron Man vs Spider Man New Home, Spider Man No Way Home, Spider Man Miles Morales Funny Animation
                    </CardHeader>

                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>{video.status}</p>
                    </CardFooter>
                </div>
            </Card>
        </Link >
    )
}