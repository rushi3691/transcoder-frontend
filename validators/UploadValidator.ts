import { z } from "zod";

export const UploadUrlRequestSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(1000).optional(),
});

export type IUploadUrlInput = z.infer<typeof UploadUrlRequestSchema>;

export const UploadUrlResponseSchema = z.object({
    url: z.string(),
    vid: z.string(),
});

export type IUploadUrlOutput = z.infer<typeof UploadUrlResponseSchema>;