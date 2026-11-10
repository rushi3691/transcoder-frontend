"use client";

import { useActionState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateVideoDetails, type EditVideoState } from "./actions";

/** Pencil button + native <dialog> form for editing a video's title and description. */
export default function EditVideo({
    video,
}: {
    video: { id: string; title: string; description: string | null };
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [state, formAction, pending] = useActionState<EditVideoState, FormData>(updateVideoDetails, {});

    // close once the save succeeds; the page re-renders with the new values
    useEffect(() => {
        if (state.ok) dialog.current?.close();
    }, [state]);

    return (
        <>
            <button
                type="button"
                onClick={() => dialog.current?.showModal()}
                title="Edit details"
                aria-label={`Edit details of ${video.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
                <Pencil className="h-4 w-4" />
            </button>

            <dialog
                ref={dialog}
                className="w-[min(32rem,calc(100vw-2rem))] rounded-2xl bg-card p-0 text-foreground shadow-2xl ring-1 ring-border backdrop:bg-black/60"
            >
                {/* key resets the fields to the saved values each time the dialog reopens after a save */}
                <form action={formAction} className="flex flex-col gap-5 p-6" key={`${video.title}\n${video.description}`}>
                    <h2 className="text-lg font-semibold">Edit details</h2>
                    <input type="hidden" name="vid" value={video.id} />

                    <div className="flex flex-col gap-2">
                        <Label htmlFor={`title-${video.id}`}>Title</Label>
                        <Input
                            id={`title-${video.id}`}
                            name="title"
                            defaultValue={video.title}
                            required
                            minLength={2}
                            maxLength={100}
                            disabled={pending}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor={`description-${video.id}`}>Description</Label>
                        <Textarea
                            id={`description-${video.id}`}
                            name="description"
                            defaultValue={video.description ?? ""}
                            maxLength={500}
                            rows={6}
                            disabled={pending}
                            className="custom-scrollbar"
                        />
                    </div>

                    {state.error && <p className="text-sm text-red-400">{state.error}</p>}

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" className="rounded-full" onClick={() => dialog.current?.close()}>
                            Cancel
                        </Button>
                        <Button type="submit" className="rounded-full px-6" disabled={pending}>
                            {pending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </dialog>
        </>
    );
}
