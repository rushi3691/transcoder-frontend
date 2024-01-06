"use client"

import Image from "next/image"
const cloudfrontUrl = 'https://d3tc1biq9ly8l.cloudfront.net/processed/';

export default function Thumbnail({id}: {id: string}) {

    return (
        <Image
            src={cloudfrontUrl + `${id}/thumb_1080p.jpg`}
            width={360} height={200}
            alt="placeholder"
            className="rounded-2xl w-full"
        />
    )
}