// app/api/comments/[id]/route.ts
import { prisma } from "@/lib/prisma";  // นำเข้า prisma client ที่สร้างไว้

// GET: ดึงคอมเมนต์ทั้งหมดสำหรับเกมที่มี id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        gameId: id,  // กรองคอมเมนต์ตาม id ของเกม
      },
      orderBy: {
        createdAt: "desc",  // เรียงลำดับตามเวลาที่คอมเมนต์ถูกสร้าง
      },
    });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching comments" }), { status: 500 });
  }
}

// POST: เพิ่มคอมเมนต์ใหม่สำหรับเกมที่มี id
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { content } = await req.json();  // รับข้อมูลจาก body ที่ส่งมา

  if (!content) {
    return new Response(JSON.stringify({ message: "Content is required" }), { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        gameId: id,   // เชื่อมโยงคอมเมนต์กับเกมโดยใช้ id
        content: content,
      },
    });

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating comment" }), { status: 500 });
  }
}
