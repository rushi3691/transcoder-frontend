import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { StatusUpdateRequestSchema } from "@/validators/StatusUpdateValidator";
import { prisma } from "@/prisma/db";
import { z } from "zod";
import { PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No session");
    return NextResponse.json({ status: 401, body: { error: "Unauthorized" } });
  }
  try {
    const { vid, status } = StatusUpdateRequestSchema.parse(
      await request.json()
    );

    // update entry to db
    const updatedVideo = await prisma.video.update({
      where: {
        id: vid,
        userId: session.user.id,
      },
      data: {
        status: status,
      },
    });


    return NextResponse.json({ status: 200, body: updatedVideo });

  } catch (e) {
    console.log(e);
    // return NextResponse.json({ status: 400, body: { error: "Bad Request" } });
    if (e instanceof z.ZodError) {
      return NextResponse.json({ status: 400, body: { error: e.message } });
    } else if (e instanceof PrismaClientUnknownRequestError) {
      return NextResponse.json({ status: 400, body: { error: e.message } });
    } else if (e instanceof Error) {
      return NextResponse.json({ status: 400, body: { error: e.message } });
    } else {
      return NextResponse.json({ status: 400, body: { error: "Bad Request" } });
    }
  }
}
