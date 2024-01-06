import { Video } from "@prisma/client";



export default function VideoInfo({ video }: { video: Video }) {
    
    const descriptionWithHashtags = getDescription(video.description!);

    return (
        <div className='flex flex-col items-start justify-start w-full gap-4 my-3'>
            <div className='text-2xl font-bold'>{video.title}</div>
            <div className='w-full bg-muted p-4 rounded-xl text-sm'>
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