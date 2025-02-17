import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // ใช้ Prisma client
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ใช้ authOptions จากไฟล์ auth.ts

// ดึงคอมเมนต์ทั้งหมดพร้อมกับชื่อผู้ใช้
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
  }

  // ดึงคอมเมนต์และข้อมูลผู้ใช้ที่ทำคอมเมนต์
  const comments = await prisma.comment.findMany({
    where: { gameId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,  // เลือกแค่ชื่อผู้ใช้
          email: true, // ถ้าต้องการข้อมูลอื่น ๆ
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
      userId: session.user.id, // ใช้ userId จาก session
      gameId,
    },
  });

  return NextResponse.json(comment);
}
