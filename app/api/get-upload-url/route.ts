import { s3client } from "@/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/prisma/db";
import {
  IUploadUrlOutput,
  UploadUrlRequestSchema,
} from "@/validators/UploadValidator";
import { getToken } from "next-auth/jwt";

// prisma schema
// model User {
//   id        Int      @id @default(autoincrement())
//   name      String
//   videos    Video[]
// }

// model Video {
//   id        Int      @id @default(autoincrement())
//   name      String
//   url       String
// }

// POST /api/videos/get-upload-url
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
 

  if (!session) {
    console.log("No session");
    return NextResponse.json({ status: 401, body: { error: "Unauthorized" } });
  }

  const { title, description } = UploadUrlRequestSchema.parse(
    await request.json()
  );


  // add entry to db
  const newVideo = await prisma.video.create({
    data: {
      title: title,
      description: description,
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  const newVideoId = newVideo.id;

  console.log("Next req: url_for: ", title, " with id: ", newVideoId);
  const url = await getSignedFileUrl({
    fileName: newVideoId,
    bucket: "rushi-video-streaming-service",
  });

  console.log("Next req: url: ", url);

  return NextResponse.json({ url, vid: newVideoId } as IUploadUrlOutput);
}

type GetSignedFileUrlArgs = {
  fileName: string;
  bucket: string;
};

const getSignedFileUrl = async ({ fileName, bucket }: GetSignedFileUrlArgs) => {
  // prefix
  const prefix = "raw/";

  // fileName
  const fileNameWithPrefix = prefix + fileName;
  console.log("put request: key:", fileNameWithPrefix);
  // return "hi";
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileNameWithPrefix,
    // max 10MB
    // ContentLength: 10000000,
    // videos only
    // ContentType: "video/*",
  });

  const url = await getSignedUrl(s3client, command, {
    expiresIn: 3600, // 1 hour
  });

  return url;
};

export default getSignedFileUrl;
