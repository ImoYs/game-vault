"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRandomGames } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function RandomGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRandomGames = async () => {
      setLoading(true);
      const gameData = await fetchRandomGames(5);
      setGames(gameData);
      setLoading(false);
    };
    loadRandomGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-black">🌀 Random Games 🌀</h1>
      {loading ? (
        <p className="text-center text-white text-lg">Loading...</p>
      ) : games.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          className="pb-6"
        >
          {games.map((game) => (
            <SwiperSlide key={game.id}>
              <Link href={`/game/${game.id}`} className="block">
                <div className="relative group overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
                  {/* Game Image */}
                  <img
                    src={game.background_image || "/default-image.jpg"}
                    alt={game.name}
                    className="w-full h-[400px] object-cover"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Game Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white font-bold text-xl bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md">
                    {game.name}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-white text-lg">No games found</p>
      )}
    </div>
  );
}
