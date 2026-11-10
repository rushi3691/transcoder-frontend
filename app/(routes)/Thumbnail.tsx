"use client"

import Image from "next/image"
import { MEDIA_URL } from '@/lib/media';

export default function Thumbnail({id}: {id: string}) {

    return (
        <Image
            src={MEDIA_URL + `${id}/thumb_1080p.jpg`}
            width={360} height={200}
            alt="placeholder"
            className="rounded-2xl w-full"
        />
    )
}