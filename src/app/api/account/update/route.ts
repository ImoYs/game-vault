import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { name, email, password } = await req.json();

  let data: any = { name, email };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;
  }

  await prisma.user.update({
    where: { email: session.user?.email },
    data,
  });

  return Response.json({ message: "Account updated successfully" });
}
