import { prisma } from "@/prisma/db";
import { VideoInfoRequestSchema } from "@/validators/VideoValidator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("lvid: ", id);

  const { vid } = VideoInfoRequestSchema.parse({vid: id});

  const video = await prisma.video.findUnique({
    where: {
      id: vid,
    },
  });

  return NextResponse.json(video);
}
