"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames } from "@/utils/api"; // ใช้ API fetchGames

export default function RandomGame() {
  const [game, setGame] = useState<any>(null); // เก็บข้อมูลเกมที่สุ่มได้
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRandomGame = async () => {
      setLoading(true);
      const allGames = await fetchGames(1, 50); // ดึงเกมทั้งหมด (หรือ 50 เกมแรก)
      const randomIndex = Math.floor(Math.random() * allGames.length); // เลือก index แบบสุ่ม
      setGame(allGames[randomIndex]); // ตั้งค่าเกมที่สุ่มได้
      setLoading(false);
    };

    loadRandomGame();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Random Game</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : game ? (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <Link href={`/game/${game.id}`}>
            <img
              src={game.background_image || "/default-image.jpg"}
              alt={game.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{game.name}</h3>
              <p className="text-sm text-gray-600 mt-2">
                {game.description || "No description available."}
              </p>
            </div>
          </Link>
        </div>
      ) : (
        <p className="text-center">No game found</p>
      )}
    </div>
  );
}
