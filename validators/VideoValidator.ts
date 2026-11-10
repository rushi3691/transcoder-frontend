import { z } from "zod";


export const VideoInfoRequestSchema = z.object({
    vid: z.string(),
});

export type IVideoInfoInput = z.infer<typeof VideoInfoRequestSchema>;

// same limits as the upload form
export const VideoDetailsSchema = z.object({
    vid: z.string().min(1),
    title: z.string().trim()
        .min(2, { message: "Title must be at least 2 characters." })
        .max(100, { message: "Title must be at most 100 characters." }),
    description: z.string().max(500, { message: "Description must be at most 500 characters." }),
});

// export const StatusUpdateResponseSchema = z.object({
//   url: z.string(),
//   vid: z.string(),
// });

// export type IStatusUpdateOutput = z.infer<typeof StatusUpdateResponseSchema>;
