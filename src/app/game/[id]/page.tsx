"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchGameDetails } from "@/utils/api/index";
import Navbar from "@/components/Navbar/Navbar";
import { useParams } from "next/navigation";
import CommentSection from "@/components/Comment/CommentSection";
import GameTrailers from "@/components/GameDetails/GameTrailers";
import GameStores from "@/components/GameDetails/GameStores";
import GameDevelopmentTeam from "@/components/GameDetails/GameDev";
import GameAdditions from "@/components/GameDetails/GameAdditions";

export default function GameDetailPage() {
  const [game, setGame] = useState(null);
  const { id } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const truncatedDescription = game?.description_raw?.slice(0, 300) || "";

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const gameResponse = await fetchGameDetails(id);
      setGame(gameResponse);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!game) {
    return <p className="text-center text-gray-500">Loading game details...</p>;
  }

  const pcPlatform = game?.platforms?.find((p) => p.platform.id === 4);
  const requirements = pcPlatform?.requirements;

  return (
    <main className="bg-white text-black min-h-screen">
      <Navbar />
      <div className="w-full px-6">
        <h1 className="text-4xl font-extrabold text-center my-6">{game.name}</h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-8 gap-6">
          {/* ช่องซ้าย ว่างไว้ */}
          <div className="col-span-1"></div>

          {/* GameTrailers (4 คอลัมน์) */}
          <div className="col-span-4">
            <GameTrailers gameId={id} />
          </div>

          {/* Game Info (2 คอลัมน์) */}
          <div className="col-span-2 bg-white p-4 rounded-lg">
            <img src={game.background_image} alt={game.name} className="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
            <h3 className="text-lg font-bold">⭐ Ratings</h3>
            <p>Metacritic: {game.metacritic ?? "N/A"}</p>
            <h3 className="text-lg font-bold">🎮 Genres</h3>
            <ul>{game.genres.map((genre) => <li key={genre.id}>{genre.name}</li>)}</ul>
            <h3 className="text-lg font-bold">📅 Released</h3>
            <p>{game.released}</p>
          </div>

          {/* ช่องขวา ว่างไว้ */}
          <div className="col-span-1"></div>
        </div>

        {/* ส่วน About & Tags */}
        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>
          <div className="col-span-4  p-4 rounded-lg">
            <h3 className="text-lg font-bold">📖 ABOUT THIS GAME</h3>
            <p>{isExpanded ? game.description_raw : truncatedDescription}</p>
            {game.description_raw.length > 300 && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500">{isExpanded ? "Read less" : "Read more"}</button>
            )}
          </div>
          <div className="col-span-2  p-4 rounded-lg">
            <h3 className="text-lg font-bold">🏷️ Tags</h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => <span key={tag.id} className="bg-gray-700 text-white px-3 py-1 rounded">{tag.name}</span>)}
            </div>
            <GameStores gameId={id} />
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* System Requirements, Reddit, DLC, Development Team, Comments */}
        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>
          <div className="col-span-4  p-4 rounded-lg">
            <h3 className="text-lg font-bold">💻 System Requirements (PC)</h3>
            {requirements ? (
              <details>
                <summary className="text-blue-500 cursor-pointer">View Requirements</summary>
                {requirements.minimum && <p><strong>Min:</strong> {requirements.minimum}</p>}
                {requirements.recommended && <p><strong>Rec:</strong> {requirements.recommended}</p>}
              </details>
            ) : <p>No system requirements available</p>}
          </div>
          <div className="col-span-2  p-4 rounded-lg">
            <h3 className="text-lg font-bold">🌐 Reddit</h3>
            {game.reddit_url && <a href={game.reddit_url} className="text-blue-500">Visit Reddit Community</a>}
          </div>
          <div className="col-span-1"></div>
        </div>

        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>
          <div className="col-span-4">
            <GameDevelopmentTeam gameId={id} />
          </div>
          <div className="col-span-2">
            <GameAdditions />
          </div>
          <div className="col-span-1"></div>


        </div>

        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div> {/* ช่องซ้ายว่าง */}

          <div className="col-span-6">
            <CommentSection gameId={id} />
          </div>

          <div className="col-span-1"></div> {/* ช่องขวาว่าง */}
        </div>

      </div>
    </main>
  );
}
