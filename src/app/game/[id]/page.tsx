"use client";

import { useState, useEffect } from "react";
import { fetchGameDetails, fetchGameScreenshots } from "@/utils/api";
import Navbar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/Navbar/NavSidebar";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GameDetailPage() {
  const [game, setGame] = useState<any>(null);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const gameResponse = await fetchGameDetails(id);
        console.log("Fetched Game Data:", gameResponse); // Debug ทั้ง object
        setGame(gameResponse);

        // เรียกฟังก์ชันดึง screenshots
        const screenshotsResponse = await fetchGameScreenshots(id, page);
        setScreenshots(screenshotsResponse);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchData();
  }, [id, page]); // เพิ่ม `page` เข้าไปใน dependency เพื่อโหลดข้อมูลใหม่เมื่อเปลี่ยนหน้า

  if (!game) {
    return <p className="text-center text-gray-500">Loading game details...</p>;
  }

  // ตรวจสอบข้อมูลแพลตฟอร์มของ PC
  const pcPlatform = game?.platforms?.find((p: any) => p.platform.id === 4);
  // console.log("PC Platform Data:", pcPlatform); // Debug PC platform data
  const requirements = pcPlatform?.requirements;
  // console.log("PC Requirements:", requirements); // Debug system requirements

  return (
    <main className="game-detail bg-white text-black">
      <Navbar />
      <NavSidebar />
      <br />

      <div className="game-header">
        <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
      </div>
      
      {/* Grid สำหรับจัดตำแหน่งข้อมูล */}
      <div className="grid grid-cols-6 gap-4 mt-6">
        {/* รูปภาพ */}
        <div className="col-span-4 col-start-2">
          {/* ใส่รูปภาพหลัก */}
          <img src={game.background_image} alt={game.name} className="w-full h-auto rounded-lg" />
        </div>

        <div className="col-span-4 col-start-2">
          {/* ใส่รูปภาพของเกมที่ต้องการ */}
          {/* Swiper สำหรับเลื่อนรูปภาพ */}
          {screenshots?.length > 0 ? (
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="w-full h-96">
              {screenshots.filter((screenshot) => screenshot.id !== -1).map((screenshot) => (
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

        {/* About Me */}
        <div className="col-start-2 col-end-4">
          <h3 className="font-bold text-lg">📝 ABOUT THIS GAME</h3>
          <p className="text-gray-600">{game.description_raw}</p>
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
      </div>

    </main>
  );
}
