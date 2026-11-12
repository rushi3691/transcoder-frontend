"use client";

import { useActionState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteVideo, type DeleteVideoState } from "./actions";

/** Trash button + native <dialog> confirmation; deletes the video and all its files. */
export default function DeleteVideo({
    video,
}: {
    video: { id: string; title: string; status: string };
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [state, formAction, pending] = useActionState<DeleteVideoState, FormData>(deleteVideo, {});
    const processing = video.status === "PENDING" || video.status === "PROCESSING";

    useEffect(() => {
        if (state.ok) dialog.current?.close();
    }, [state]);

    return (
        <>
            <button
                type="button"
                onClick={() => dialog.current?.showModal()}
                disabled={processing}
                title={processing ? "Can't delete while the video is processing" : "Delete video"}
                aria-label={`Delete ${video.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-red-500/15 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            <dialog
                ref={dialog}
                className="w-[min(28rem,calc(100vw-2rem))] rounded-2xl bg-card p-0 text-foreground shadow-2xl ring-1 ring-border backdrop:bg-black/60"
            >
                <form action={formAction} className="flex flex-col gap-4 p-6">
                    <h2 className="text-lg font-semibold">Delete video?</h2>
                    <input type="hidden" name="vid" value={video.id} />
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{video.title}</span> and all of its files (the
                        original upload, every quality, thumbnails and previews) will be permanently deleted. This
                        can&apos;t be undone.
                    </p>

                    {state.error && <p className="text-sm text-red-400">{state.error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="rounded-full" onClick={() => dialog.current?.close()} disabled={pending}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="destructive" className="rounded-full px-6" disabled={pending}>
                            {pending ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </form>
            </dialog>
        </>
    );
}
