"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchGameDetails, fetchGameScreenshots, fetchGameTrailers } from "@/utils/api/index";
import Navbar from "@/components/Navbar/Navbar";

import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CommentSection from "@/components/Comment/CommentSection"; // import คอมโพเนนต์ที่แยกแล้ว
import GameTrailers from "@/components/GameDetails/GameTrailers"; // ✅ นำเข้า Component Trailers
import GameStores from "@/components/GameDetails/GameStores"; // 


export default function GameDetailPage() {
  const [game, setGame] = useState<any>(null);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]);
  const { id } = useParams();

  const [isExpanded, setIsExpanded] = useState(false); // ใช้สำหรับควบคุมการขยายข้อความ
  const truncatedDescription = game?.description_raw?.slice(0, 300) || ''; // ตัดข้อความให้เหลือ 200 ตัวอักษร

  // ฟังก์ชันดึงข้อมูลเกม
  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const gameResponse = await fetchGameDetails(id);
      setGame(gameResponse);

      const screenshotsResponse = await fetchGameScreenshots(id);
      setScreenshots(screenshotsResponse);

      const trailersResponse = await fetchGameTrailers(id);
      setTrailers(trailersResponse);
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

  const pcPlatform = game?.platforms?.find((p: any) => p.platform.id === 4);
  const requirements = pcPlatform?.requirements;

  return (
    <main className="game-detail bg-white text-black">
      <Navbar />

      <br />

      <div className="game-header">
        <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
      </div>

      {/* Grid สำหรับจัดตำแหน่งข้อมูล */}
      <div className="grid grid-cols-6 gap-4 mt-6">
        {/* รูปภาพ */}
        <div className="col-span-4 col-start-2">
          <img src={game.background_image} alt={game.name} className="w-full h-auto rounded-lg" />
        </div>

        {/* ✅ เรียกใช้ GameTrailers Component */}
        <GameTrailers gameId={id as string} />

        {/* Screenshots */}
        <div className="col-span-4 col-start-2">
          {screenshots?.length > 0 ? (
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="w-full h-96">
              {screenshots.map((screenshot) => (
                <SwiperSlide key={screenshot.id}>
                  <img
                    src={screenshot.image}
                    alt={`Screenshot ${screenshot.id}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => console.error("Image failed to load:", screenshot.image)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-gray-500">No screenshots available</p>
          )}
        </div>

        {/* About Game */}
        <div className="col-start-2 col-end-4">
          <h3 className="font-bold text-lg">📝 ABOUT THIS GAME</h3>
          <p className="text-gray-600">
            {isExpanded ? game.description_raw : truncatedDescription}
            {/* ถ้าเป็นโหมดขยาย (isExpanded), จะแสดงข้อความทั้งหมด */}
            {!isExpanded && game.description_raw.length > 300 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-blue-500 cursor-pointer ml-1"
              >
                Read more
              </button>
            )}
            {isExpanded && game.description_raw.length > 300 && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-blue-500 cursor-pointer ml-1"
              >
                Read less
              </button>
            )}
          </p>
        </div>

        {/* Ratings, Genres, Released */}
        <div className="col-span-2 col-end-6">
          <h3 className="font-bold text-lg">⭐ Ratings</h3>
          <p>Metacritic: {game.metacritic ?? "N/A"}</p>
          <h3 className="font-bold text-lg">🕹️ Genres</h3>
          <ul className="text-gray-600">
            {game.genres.map((genre: any) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
          <h3 className="font-bold text-lg">📅 Released</h3>
          <p>{game.released}</p>
        </div>

        {/* Tags */}
        <div className="col-span-4 col-start-2 mt-6">
          <h3 className="font-bold text-lg">🏷 Tags</h3>
          <div className="flex flex-wrap gap-2">
            {game.tags.map((tag: any) => (
              <span key={tag.id} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="col-start-2 col-end-4 mt-6">
          <h3 className="font-bold text-lg">🎮 Platforms</h3>
          <ul className="text-gray-600">
            {game.platforms.map((platform: any) => (
              <li key={platform.platform.id}>{platform.platform.name}</li>
            ))}
          </ul>
        </div>

        {/* ✅ เรียกใช้ GameStores Component */}
        <GameStores gameId={id} />

        {/* System Requirements */}
        <div className="col-span-2 col-end-6 mt-6">
          <h3 className="font-bold text-lg">💻 System Requirements (PC)</h3>
          {requirements ? (
            <details className="cursor-pointer">
              <summary className="text-blue-600 underline">View System Requirements</summary>
              {requirements.minimum && <p><strong>Minimum:</strong> {requirements.minimum}</p>}
              {requirements.recommended && <p><strong>Recommended:</strong> {requirements.recommended}</p>}
            </details>
          ) : (
            <p className="text-gray-500">No system requirements available</p>
          )}
        </div>

        {/* Visit Reddit Community */}
        <div className="col-span-4 col-start-2 mt-6">
          <h3 className="font-bold text-lg">Reddit</h3>
          {game?.reddit_url && (
            <p className="text-blue-600 mt-2">
              🔗 <a href={game.reddit_url} target="_blank" rel="noopener noreferrer" className="underline">
                Visit Reddit Community
              </a>
            </p>
          )}
        </div>

        {/* Comment Section */}
        <div className="col-span-4 col-start-2 mt-6">
          <CommentSection gameId={id} />
        </div>
      </div>

    </main>
  );
}
