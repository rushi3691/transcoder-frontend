"use client"

import '@videojs/react/video/skin.css';
import { VideoPlayer, VideoSkin } from '@videojs/react/video';
import { HlsJsVideo } from '@videojs/react/media/hlsjs-video';
import { GoogleCast } from '@videojs/react/extensions/google-cast';

import { Video } from '@prisma/client';

import { MEDIA_URL } from '@/lib/media';

/**
 * Video.js 10 player: HLS via hls.js, poster, title, seek-bar sprite previews
 * (sprite.vtt with #xywh cues) and the default video skin (quality, speed, audio,
 * captions, PiP, fullscreen, AirPlay, Google Cast).
 */
export default function Player({ video }: { video: Video }) {
    const base = MEDIA_URL + video.id;

    return (
        <VideoPlayer title={video.title} poster={`${base}/thumb_4k.jpg`}>
            {/* Vidstack gave the player a 16:9 box; Video.js skins don't */}
            <VideoSkin
                className="player"
                style={{ aspectRatio: '16 / 9' }}
                // ponytail: Video.js 10.3 only resolves relative cue URLs (sprite.jpg#xywh=...) against the
                // .vtt when the media is a plain <video>; with HlsJsVideo they resolve against the page URL.
                // Resolve them against sprite.vtt ourselves; drop this once Video.js fixes findTrackElement.
                renderThumbnail={(props) => {
                    const src = (props as { src?: string }).src;
                    return (
                        // eslint-disable-next-line @next/next/no-img-element -- skin-sized sprite crop, not a next/image
                        <img {...props} alt="" src={src && new URL(src, `${base}/sprite.vtt`).href} />
                    );
                }}
            >
                {/* crossOrigin: the thumbnails track is fetched from the R2 media domain */}
                <HlsJsVideo src={`${base}/master.m3u8`} crossOrigin="anonymous" playsInline>
                    <track kind="metadata" label="thumbnails" src={`${base}/sprite.vtt`} default />
                    {/* // ! don't delete: captions/chapters from ./tracks
                    {textTracks.map((track) => (
                        <track key={track.src} kind={track.kind} src={track.src} srcLang={track.language} label={track.label} default={track.default} />
                    ))} */}
                </HlsJsVideo>
                {/* enables the skin's Cast button for Chromecast (without it, only the browser's Remote Playback API) */}
                <GoogleCast />
            </VideoSkin>
        </VideoPlayer>
    );
}
