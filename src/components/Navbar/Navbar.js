"use client"; // ระบุว่าเป็น Client Component

import { useSession, signOut } from "next-auth/react"; // ใช้ useSession และ signOut จาก NextAuth.js
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession(); // ดึงข้อมูล session

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">My Website</Link>
        </div>
        <div className="space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/games" className="hover:underline">
            Games
          </Link>
          
          {/* ถ้าผู้ใช้ล็อกอินแล้ว ให้แสดงปุ่ม Account และ Logout */}
          {status === "authenticated" ? (
            <>
              <Link href="/account" className="hover:underline">
                {session.user?.name || "Account"}
              </Link>
              <button
                onClick={() => signOut()}
                className="hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            // ถ้าผู้ใช้ยังไม่ได้ล็อกอิน แสดงปุ่ม login
            <Link href="/api/auth/signin" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
