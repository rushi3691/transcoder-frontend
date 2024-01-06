import { z } from "zod";


export const VideoInfoRequestSchema = z.object({
    vid: z.string(),
});

export type IVideoInfoInput = z.infer<typeof VideoInfoRequestSchema>;

// export const StatusUpdateResponseSchema = z.object({
//   url: z.string(),
//   vid: z.string(),
// });

// export type IStatusUpdateOutput = z.infer<typeof StatusUpdateResponseSchema>;
