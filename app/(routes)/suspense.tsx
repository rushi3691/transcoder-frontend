import { Skeleton } from "@/components/ui/skeleton";

export default function ListSuspense() {
    const n = 9; // replace 5 with the number of times you want to render the div
    return (
        <>
            {
                Array.from({ length: n }).map((_, index) => (
                    <div key={index} className="w-full">
                        <Loadingcard />
                    </div>
                ))
            }
        </>
    )
}

function Loadingcard() {
    return (
        <div>

            <Skeleton className="w-full h-[200px] rounded-xl" />
            <div className="px-1 py-4">
                <Skeleton className="font-bold text-xl mb-2 h-[20px] w-1/2" />
                <Skeleton className="text-gray-400 text-sm text-wrap h-[20px]" />
                {/* <p className="text-gray-400 text-sm ">{video.createdAt.toLocaleDateString()}</p> */}
            </div>
        </div>
    )
}