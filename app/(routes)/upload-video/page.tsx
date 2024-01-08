"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { Progress } from "@/components/ui/progress"
import { IUploadUrlInput, IUploadUrlOutput } from "@/validators/UploadValidator"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "title must be at least 2 characters.",
    }).max(100, {
        message: "title must be at most 100 characters.",
    }),
    description: z.string().max(500, {
        message: "description must be at most 500 characters.",
    }).optional(),
    video_file: typeof FileList !== 'undefined' ? z.instanceof(FileList, {
        message: "video file must be present"
    }).refine(fileList => fileList.length > 0 && fileList[0].size <= 10 * 1024 * 1024, {
        message: "video file must be less than or equal to 10MB",
    }) : z.any()
})

export default function ProfileForm() {

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const { data: session } = useSession();
    const cancelTokenSource = axios.CancelToken.source();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })

    if (!session || session.user.email !== "pink53906@gmail.com") return null;



    const getUploadUrl = async ({ title, description }: IUploadUrlInput) => {

        const res = await axios.post(
            "/api/get-upload-url",
            { title, description } as IUploadUrlInput,
            { cancelToken: cancelTokenSource.token }
        );

        if (res.status !== 200) {
            throw new Error(JSON.stringify(res.data));
        }
        const { url, vid } = res.data as IUploadUrlOutput;
        return { url, vid };
    }


    const cancelUpload = () => {
        cancelTokenSource.cancel();
    }


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            setUploading(true);
            const { url, vid } = await getUploadUrl(values);

            if (!url) {
                throw new Error("Failed to get upload url");
            }

            const res = await axios.put(url, values.video_file?.[0], {
                cancelToken: cancelTokenSource.token,
                onUploadProgress: (e) => {
                    if (e.total) {
                        setProgress(Math.round((e.loaded * 100) / e.total));
                    }
                },
            });

            if (res.status !== 200) {
                throw new Error("Failed to upload video");
            }

            // update video status to pending
            const res2 = await axios.post("/api/update-video-status", {
                vid,
                status: "PENDING",
            });

            if (res2.status !== 200) {
                throw new Error("Failed to update video status");
            }

            console.log("upload successful")

        } catch (err) {
            if (axios.isCancel(err)) {
                console.log("Upload cancelled");
            } else {
                console.error(err);
            }
        } finally {
            setUploading(false);
            setProgress(0);
            form.reset();
            // document.getElementById(field).value = ''

            let input = document.getElementById("video_file") as HTMLInputElement | null;
            if (input) {
                input.value = "";
            }
            // form.setValue("video_file", null);
        }
    }
    return (
        <div className="ml-52 mt-16 w-full h-3/4 flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[30%]">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="title" {...field} disabled={uploading} />
                                </FormControl>
                                <FormDescription>
                                    Give a title for your video.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video Description</FormLabel>
                                <FormControl>
                                    {/* <Input placeholder="description" {...field} disabled={uploading} /> */}
                                    <Textarea placeholder="description" {...field} disabled={uploading} className="custom-scrollbar" />

                                </FormControl>
                                <FormDescription>
                                    Give a brief description of your video.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="video_file"
                        render={({ field: { onChange, onBlur, name, ref } }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Video File</FormLabel>
                                <FormControl>
                                    <input
                                        id="video_file"
                                        type="file"
                                        accept=".mp4,.mkv,.webm"
                                        onChange={(e) => {
                                            onChange(e.target.files);
                                        }}
                                        onBlur={onBlur}
                                        name={name}
                                        ref={ref}
                                        disabled={uploading}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Select a video file to upload.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-6 items-center">
                        {uploading ?
                            <div className="flex gap-4 items-center w-full">
                                <Button onClick={cancelUpload} variant="destructive" type="button">
                                    Cancel
                                </Button>
                                <Progress value={progress} />
                            </div>
                            :
                            <Button type="submit" disabled={uploading}>Upload</Button>
                        }
                    </div>
                </form>
            </Form>
        </div>
    )
}
