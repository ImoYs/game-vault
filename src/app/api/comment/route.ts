import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching comments...');
  const comments = await prisma.comment.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true
    }
  });
  console.log(comments);
  return comments;
}


main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
