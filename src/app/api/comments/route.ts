// \src\app\api\comments\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ดึงคอมเมนต์ทั้งหมด
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { gameId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,  // ✅ ดึง userId มาด้วยเพื่อเช็คว่าใครเป็นเจ้าของคอมเมนต์
          name: true,
        },
      },
    },
  });

  return NextResponse.json(comments);
}

// เพิ่มคอมเมนต์
export async function POST(req: NextRequest) {
  const { content, gameId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!content || !gameId) {
    return NextResponse.json({ error: "Missing content or gameId" }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      userId: session.user.id,
      gameId,
    },
  });

  return NextResponse.json(comment);
}

// แก้ไขคอมเมนต์
export async function PATCH(req: NextRequest) {
  const { commentId, content } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // ✅ ตรวจสอบว่าเป็นเจ้าของคอมเมนต์หรือไม่
  if (comment.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  return NextResponse.json(updatedComment);
}

// ลบคอมเมนต์
export async function DELETE(req: NextRequest) {
  const { commentId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // ✅ ตรวจสอบว่าเป็นเจ้าของคอมเมนต์หรือไม่
  if (comment.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return NextResponse.json({ message: "Comment deleted successfully" });
}
