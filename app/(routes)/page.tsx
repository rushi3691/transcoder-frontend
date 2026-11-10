import { Suspense } from "react";
import ListSuspense from "./suspense";
import ListVideos from "./listVideos";

export default async function Home() {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-10 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 2xl:grid-cols-4">
      <Suspense fallback={<ListSuspense />}>
        <ListVideos />
      </Suspense>
    </div>
  );
}
