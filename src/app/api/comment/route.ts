import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function get() {
  try {
    const comments = await prisma.comment.findMany({
      select: {
        id: true, // ใช้เป็น key ใน React
        content: true,
        createdAt: true,
        user: {
          select: { name: true } // ดึงเฉพาะชื่อผู้ใช้
        },
        game: {
          select: { title: true } // ดึงเฉพาะชื่อเกม
        }
      }
    });

    return comments; // Ensure the function returns the data
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client to prevent connection leaks
  }
}
