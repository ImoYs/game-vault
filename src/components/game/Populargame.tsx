"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames } from "@/utils/api"; // ใช้ API fetchGames

export default function TopGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      const topGames = await fetchGames(1, 10); // ดึงข้อมูล 10 อันดับแรก
      setGames(topGames);
      setLoading(false);
    };

    loadGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Top 10 Games</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <li key={game.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Link href={`/game/${game.id}`}>
                <img
                  src={game.background_image || "/default-image.jpg"}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{game.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {game.description || "No description available."}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
