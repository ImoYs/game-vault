import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  await prisma.user.delete({
    where: { email: session.user?.email },
  });

  return Response.json({ message: "Account deleted, redirecting..." });
}
