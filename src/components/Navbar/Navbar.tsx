"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">My Website</Link>
        </div>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">
            home
          </Link>
          <Link href="/games" className="hover:underline">
            Games
          </Link>

          {session ? (
            <>
              <span className="font-bold">{session.user?.email}</span>
              <button onClick={() => signOut()} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/signin" className="hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
