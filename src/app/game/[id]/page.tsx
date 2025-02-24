"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchGameDetails } from "@/utils/api/index";
import Navbar from "@/components/Navbar/Navbar";
import { useParams } from "next/navigation";
import CommentSection from "@/components/Comment/CommentSection";
import GameTrailers from "@/components/GameDetails/GameTrailers";
import GameStores from "@/components/GameDetails/GameStores";
import GameAdditions from "@/components/GameDetails/GameAdditions";
import { format } from 'date-fns'; // Import ฟังก์ชัน format
import { enUS } from 'date-fns/locale'; // Import locale ของ date-fns

export default function GameDetailPage() {
  const [game, setGame] = useState(null);
  const { id } = useParams() as { id: string };
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
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
        <br></br><br></br>

        {/* Grid Layout */}
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-1"></div> {/* ช่องซ้ายว่าง */}

          {/* แถว 1: Trailer + Screenshots (4 ช่อง) | รูปเกม (2 ช่อง) */}
          <div className="col-span-4">
            <GameTrailers gameId={id} />
          </div>

          <div className="col-span-2">
            <img src={game.background_image} alt={game.name} className="w-full h-48 object-cover rounded-lg shadow-lg" />
            <h2 className="text-4xl font-extrabold my-6">{game.name}</h2>

            {/* Using grid for the specific layout */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold"> Ratings</h3>
                {/* <p>Metacritic: {game.metacritic ?? "N/A"}</p> */}
                <p>rating: {game.rating ?? "N/A"}</p>
 

                <h3 className="text-lg font-bold mt-4"> Released</h3>
                <p>{game.released}</p>
                {format(new Date(game.released), 'dd MMM yyyy', { locale: enUS })}

                <h3 className="text-lg font-bold mt-4"> Genres</h3>
                <p>{game.genres.map((genre) => genre.name).join(", ")}</p>


              </div>

              <div>
                <h3 className="text-lg font-bold"> Platforms</h3>
                <ul>{game.platforms.map((p) => <li key={p.platform.id}>{p.platform.name}</li>)}</ul>
              </div>
            </div>
          </div>

          <div className="col-span-1"></div> {/* ช่องขวาว่าง */}
        </div>

        {/* แถว 2: ABOUT THIS GAME (4 ช่อง) | Game Info (1 ช่อง) | Platforms (1 ช่อง) */}
        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>

          <div className="col-span-4 bg-white p-4 rounded-lg">
            <h3 className="text-lg font-bold">ABOUT THIS GAME</h3>
            <p>{isExpanded ? game.description_raw : truncatedDescription}</p>
            {game.description_raw.length > 300 && (
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500">
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
          <div className="col-span-2">
            <h3 className="text-lg font-bold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {(showAllTags ? game.tags : game.tags.slice(0, 4)).map((tag) => (
                <span key={tag.id} className="bg-gray-700 text-white px-3 py-1 rounded">{tag.name}</span>
              ))}
            </div>
            <button onClick={() => setShowAllTags(!showAllTags)} className="text-blue-500 mt-2">
              {showAllTags ? "Show less" : "Show more"}
            </button>
          </div>


          <div className="col-span-1"></div>
        </div>

        {/* แถว 3: GameStores (4 ช่อง) | Tags (2 ช่อง) */}
        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>
          <div className="col-span-4">
            <GameStores gameId={id} />
          </div>


          <div className="col-span-1"></div>
        </div>

        {/* แถว 4: System Requirements (3 ช่อง) | Reddit (3 ช่อง) */}
        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>
          <div className="col-span-3">
            <h3 className="text-lg font-bold">System Requirements (PC)</h3>
            {requirements ? (
              <details>
                <summary className="text-blue-500 cursor-pointer">View Requirements</summary>
                {requirements.minimum && <p><strong>Min:</strong> {requirements.minimum}</p>}
                {requirements.recommended && <p><strong>Rec:</strong> {requirements.recommended}</p>}
              </details>
            ) : <p>No system requirements available</p>}
          </div>
          <div className="col-span-3">
            <h3 className="text-lg font-bold">Reddit</h3>
            {game.reddit_url && <a href={game.reddit_url} className="text-blue-500">Visit Reddit Community</a>}
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* แถว 5: GameAdditions (6 ช่อง) */}
        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>
          <div className="col-span-6">
            <GameAdditions />
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* แถว 6: Comment Section (6 ช่อง) */}
        <div className="grid grid-cols-8 gap-6 mt-6">
          <div className="col-span-1"></div>
          <div className="col-span-6">
            <CommentSection gameId={id} />
          </div>
          <div className="col-span-1"></div>
        </div>

        {/* <GameDevelopmentTeam gameId={id} /> */}
      </div>
    </main>
  );
}