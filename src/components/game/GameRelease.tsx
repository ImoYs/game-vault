"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPopularGames } from "@/utils/api/index"; // ใช้ API fetchPopularGames
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function PopularGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [genre, setGenre] = useState<string>("action"); // ค่าเริ่มต้นเป็น "action"

  useEffect(() => {
    const loadPopularGames = async () => {
      setLoading(true);
      const { results } = await fetchPopularGames(genre); // ดึงข้อมูลจาก API ตาม genre

      setGames(results);
      setLoading(false);
    };

    loadPopularGames();
  }, [genre]); // Fetch ใหม่เมื่อ genre เปลี่ยน

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <select
          className="p-2 border rounded-md"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="action">Action</option>
          <option value="adventure">Adventure</option>
          <option value="rpg">RPG</option>
          <option value="strategy">Strategy</option>
          <option value="sports">Sports</option>
        </select>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">
        Popular {genre.charAt(0).toUpperCase() + genre.slice(1)} Games
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : games.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={5}
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
        >
          {games.map((game) => (
            <SwiperSlide key={game.id}>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <Link href={`/game/${game.id}`}>
                  <img
                    src={game.background_image || "/default-image.jpg"}
                    alt={game.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{game.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      ⭐ Rating: {game.rating ? game.rating.toFixed(1) : "N/A"} / 5
                    </p>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center">No popular games found</p>
      )}
    </div>
  );
}
