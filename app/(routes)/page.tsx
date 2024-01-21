import { Suspense } from "react";
import ListSuspense from "./suspense";
import ListVideos from "./listVideos";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    // handle overflow in y axis
    <div className="ml-60 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 m-10 w-full h-full">
      <Suspense fallback={<ListSuspense/>}>
        <ListVideos />
      </Suspense>
    </div >
  );
}
