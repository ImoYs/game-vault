import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ดึงคอมเมนต์ทั้งหมด (ปรับปรุงให้ดึง replies มาด้วย)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
  }

  // ดึงเฉพาะ root comments และ include replies แบบ nested
  const rootComments = await prisma.comment.findMany({
    where: { gameId, parentId: null }, // ดึงเฉพาะ root comments ที่ parentId เป็น null
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      replies: { // Include replies แบบ nested
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "asc" }, // เรียง replies ตาม createdAt
      },
    },
  });

  return NextResponse.json(rootComments);
}

// เพิ่มคอมเมนต์ (รองรับ parentId สำหรับ reply)
export async function POST(req: NextRequest) {
  const { content, gameId, parentId } = await req.json();
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
      parentId: parentId || null, // กำหนด parentId หรือ null ถ้าไม่มี (root comment)
    },
    include: { // Include user data in the response
      user: {
        select: { id: true, name: true },
      },
      replies: { // Include replies in the response (though initially empty)
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  return NextResponse.json(comment);
}

// แก้ไขคอมเมนต์ (เหมือนเดิม)
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

  if (comment.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
    include: { // Include user data in the response
      user: {
        select: { id: true, name: true },
      },
      replies: { // Include replies in the response
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  return NextResponse.json(updatedComment);
}

// ลบคอมเมนต์ (เหมือนเดิม)
// ... imports ...

// ลบคอมเมนต์ (แก้ไขให้ลบ replies ที่เกี่ยวข้องด้วย)
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

  if (comment.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ✅ ลบ replies ทั้งหมดของ comment หลักนี้ก่อน
  await prisma.comment.deleteMany({
    where: { parentId: commentId },
  });

  // ✅ จากนั้นค่อยลบคอมเมนต์หลัก
  await prisma.comment.delete({
    where: { id: commentId },
  });

  return NextResponse.json({ message: "Comment and replies deleted successfully" });
}