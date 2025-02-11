"use client";

import { useState, useEffect } from "react";
import { fetchGameDetails } from "@/utils/api";
import Navbar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/Navbar/NavSidebar";
import { useParams } from "next/navigation"; // ใช้ useParams แทนการเข้าถึง params.id ตรงๆ

export default function GameDetailPage() {
  const [game, setGame] = useState<any>(null);
  const { id } = useParams(); // ดึง params ด้วย useParams

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const gameResponse = await fetchGameDetails(id);
        setGame(gameResponse);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!game) {
    return <p>Game not found</p>;
  }

  return (
    <main className="game-detail">
      <Navbar />
      <NavSidebar />
      <div className="game-header">
        <h1>{game.name}</h1>
        <img src={game.background_image} alt={game.name} className="game-banner" />
      </div>

      <div className="game-info">
        <h2>📝 About</h2>
        <p>{game.description_raw}</p>

        <div className="info-grid">
          <div>
            <h3>🕹️ Genres</h3>
            <ul>
              {game.genres.map((genre: any) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>🎮 Platforms</h3>
            <ul>
              {game.platforms.map((platform: any) => (
                <li key={platform.platform.id}>{platform.platform.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>⭐ Ratings</h3>
            <p>Metacritic: {game.metacritic ?? "N/A"}</p>
          </div>

          <div>
            <h3>📅 Released</h3>
            <p>{game.released}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
