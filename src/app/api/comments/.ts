import { prisma } from "@/lib/prisma"; // เชื่อมต่อ Prisma Client
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gameId } = req.query;

  if (req.method === "GET") {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          gameId: gameId as string, // ใช้ gameId จาก query
        },
        include: {
          user: true, // ดึงข้อมูลผู้ใช้ที่โพสต์คอมเมนต์
        },
      });

      return res.status(200).json(comments); // ส่งคืนข้อมูลคอมเมนต์ทั้งหมดของเกม
    } catch (error) {
      return res.status(500).json({ message: "Error fetching comments" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
