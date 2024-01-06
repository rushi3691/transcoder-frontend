"use client"
import { useRef, useState } from 'react';
import "./player.module.css"
import {
    isHLSProvider,
    MediaPlayer,
    MediaProvider,
    Poster,
    type MediaCanPlayDetail,
    type MediaCanPlayEvent,
    type MediaPlayerInstance,
    type MediaProviderAdapter,
    type MediaProviderChangeEvent,
} from '@vidstack/react';
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';

import { Video } from '@prisma/client';

const cloudfrontUrl = 'https://d3tc1biq9ly8l.cloudfront.net/processed/';

export default function Player({ video }: { video: Video }) {
    const player = useRef<MediaPlayerInstance>(null);
    const url = cloudfrontUrl + `${video.id}/master.m3u8`
    const [src, setSrc] = useState(url);

    function onProviderChange(
        provider: MediaProviderAdapter | null,
        nativeEvent: MediaProviderChangeEvent,
    ) {
        // We can configure provider's here.
        if (isHLSProvider(provider)) {
            provider.config = {};
        }
    }

    // We can listen for the `can-play` event to be notified when the player is ready.
    function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
        // ...
    }

    // function changeSource(type: string) {
    //     const muxPlaybackId = 'VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU';
    //     switch (type) {
    //         case 'audio':
    //             setSrc('https://media-files.vidstack.io/sprite-fight/audio.mp3');
    //             break;
    //         case 'video':
    //             setSrc(`https://stream.mux.com/${muxPlaybackId}/low.mp4`);
    //             break;
    //         case 'hls':
    //             setSrc(url);
    //             break;
    //         case 'youtube':
    //             setSrc('youtube/_cMxraX_5RE');
    //             break;
    //         case 'vimeo':
    //             setSrc('vimeo/640499893');
    //             break;
    //     }

    // }

    return (
        <>
            <MediaPlayer
                className="player"
                title={video.title || 'Loading...'}
                src={src}
                crossorigin
                playsinline
                onProviderChange={onProviderChange}
                onCanPlay={onCanPlay}
                ref={player}
            >
                <MediaProvider>
                    <Poster
                        className="vds-poster"
                        src={cloudfrontUrl + `${video.id}/thumb_4k.jpg`}
                        alt={video.title || 'Loading...'}
                    />
                    {/* // ! don't delete */}
                    {/* {textTracks.map((track) => (
                            <Track {...track} key={track.src} />
                        ))} */}
                </MediaProvider>

                {/* Layouts */}
                {/* <DefaultAudioLayout icons={defaultLayoutIcons} /> */}
                <DefaultVideoLayout
                    icons={defaultLayoutIcons}

                // radioGroup=''
                // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
                />
            </MediaPlayer>

            {/* <div className="src-buttons">
                <button onClick={() => changeSource('audio')}>Audio</button>
                <button onClick={() => changeSource('video')}>Video</button>
                <button onClick={() => changeSource('hls')}>HLS</button>
                <button onClick={() => changeSource('youtube')}>YouTube</button>
                <button onClick={() => changeSource('vimeo')}>Vimeo</button>
            </div> */}
            {/* </div> */}
        </>
    );
}
