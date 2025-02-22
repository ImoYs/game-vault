import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // นำเข้า authOptions ที่แยกไว้

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
