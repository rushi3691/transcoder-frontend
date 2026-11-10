import Avatar from "@/components/custom-components/avatar";
import { VideoWithUser } from "@/components/custom-components/video-card";
import { timeAgo } from "@/lib/utils";



export default function VideoInfo({ video }: { video: VideoWithUser }) {

    const descriptionWithHashtags = getDescription(video.description!);

    return (
        <div className='flex w-full flex-col gap-3'>
            <h1 className='text-xl font-bold leading-7'>{video.title}</h1>
            <div className='flex items-center gap-3'>
                <Avatar name={video.user.name} image={video.user.image} size={40} />
                <span className='font-medium'>{video.user.name}</span>
            </div>
            <div className='w-full rounded-xl bg-muted p-3 text-sm'>
                <p className='mb-1 font-medium'>
                    {video.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span className='ml-2 text-muted-foreground'>{timeAgo(video.createdAt)}</span>
                </p>
                {descriptionWithHashtags}
            </div>
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
                            return <span key={wordIdx} className='text-sky-400'>{word}</span>;
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
