"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { fetchPopularGames } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const GENRES = [
  { key: "action", label: "Action" },  // ตัวอย่าง: แสดงแค่ Action Genre
  { key: "adventure", label: "Adventure" },
  { key: "role-playing-games-rpg", label: "RPG" },
  { key: "strategy", label: "Strategy" },
  { key: "sports", label: "Sports" }
];

export default function PopularGames() {
  const [gamesByGenre, setGamesByGenre] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const loadedGenres = useRef(new Set());

  useEffect(() => {
    const loadGenre = async () => {
      const genreToLoad = "action";  // เลือก genre ที่ต้องการแสดง
      setLoading(true);
      if (!loadedGenres.current.has(genreToLoad)) {
        const { results } = await fetchPopularGames(genreToLoad);
        loadedGenres.current.add(genreToLoad);
        setGamesByGenre({ [genreToLoad]: results });
      }
      setLoading(false);
    };

    loadGenre();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Popular Games</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : (
        <>
          <div key="action" className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Action</h2>

            {gamesByGenre["action"] && gamesByGenre["action"].length > 0 ? (
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={3}
                spaceBetween={30}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="rounded-lg overflow-hidden"
              >
                {gamesByGenre["action"].map((game) => (
                  <SwiperSlide key={game.id} className="p-2">
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                      <Link href={`/game/${game.id}`} className="block">
                        <img
                          src={game.background_image || "/default-image.jpg"}
                          alt={game.name}
                          className="w-full h-56 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{game.name}</h3>
                          <p className="text-md text-gray-700 mt-2">
                            ⭐ Rating: {game.rating ? game.rating.toFixed(1) : "N/A"} / 5
                          </p>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-center text-lg text-gray-600">No popular games found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
