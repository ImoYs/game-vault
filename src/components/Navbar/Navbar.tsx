"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchGenres } from "@/utils/api/index";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const [genres, setGenres] = useState<any[]>([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    loadGenres();
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleGenreClick = (e: React.MouseEvent) => {
    e.preventDefault(); // ป้องกันไม่ให้เมนู "Genres" นำทางไปที่หน้าอื่น
    setIsDropdownOpen((prev) => !prev); // สลับสถานะการเปิด/ปิด dropdown
  };

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/">GAME VAULT</Link>
        </div>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/games" className="hover:underline">
            All-Games
          </Link>

          {/* Dropdown for genres */}
          <div className="relative">
            <button
              onClick={handleGenreClick}
              className="text-white hover:underline cursor-pointer"
            >
              Genres
            </button>
            {isDropdownOpen && (
              <div
                className="absolute left-0 mt-2 space-y-2 bg-black shadow-lg z-50 rounded-lg overflow-y-auto max-h-64 w-48 transition-all duration-300"
              >
                {genres.length > 0 ? (
                  genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genres/${genre.slug}`}
                      className="block px-6 py-3 text-white hover:bg-gray-700 transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))
                ) : (
                  <p className="block px-6 py-3 text-gray-500">Loading...</p>
                )}
              </div>
            )}
          </div>

          {session ? (
            <>
              <Link href="/account" className="hover:underline">
                Account
              </Link>
              <span className="font-bold">{session.user?.name}</span>
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
