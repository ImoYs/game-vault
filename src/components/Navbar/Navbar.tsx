"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false }); // ป้องกันการ Redirect อัตโนมัติ
    router.push("/"); // กลับไปหน้า Home
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">My Website</Link>
        </div>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/games" className="hover:underline">
            Games
          </Link>

          {session ? (
            <>
              <Link href="/account" className="hover:underline">
                Account
              </Link>
              <span className="font-bold">{session.user?.email}</span>
              <button
                onClick={handleLogout}
                className="hover:underline text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:underline">
                Login
              </Link>
              <Link href="/auth/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
