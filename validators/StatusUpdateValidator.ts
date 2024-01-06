import { z } from "zod";

//   status can only be one of the following:
//   UNUPLOADED
//   PENDING
//   PROCESSING
//   READY
//   FAILED
//   DELETED
const VideoStatusSchema = z.enum(["UNUPLOADED", "PENDING", "PROCESSING", "READY", "FAILED", "DELETED"]);

export const StatusUpdateRequestSchema = z.object({
  vid: z.string(),
  status: VideoStatusSchema,
});

export type IStatusUpdateInput = z.infer<typeof StatusUpdateRequestSchema>;

// export const StatusUpdateResponseSchema = z.object({
//   url: z.string(),
//   vid: z.string(),
// });

// export type IStatusUpdateOutput = z.infer<typeof StatusUpdateResponseSchema>;
