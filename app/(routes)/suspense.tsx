import { Skeleton } from "@/components/ui/skeleton";

export default function ListSuspense() {
    return (
        <>
            {Array.from({ length: 8 }).map((_, index) => (
                <Loadingcard key={index} />
            ))}
        </>
    )
}

// mirrors VideoCard: 16:9 thumbnail, avatar, two text lines
function Loadingcard() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="flex gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="flex w-full flex-col gap-2">
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </div>
    )
}
