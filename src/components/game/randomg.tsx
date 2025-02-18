"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRandomGames } from "@/utils/api";
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
      <h1 className="text-3xl font-bold text-center mb-6">Random Games</h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : games.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
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
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center">No games found</p>
      )}
    </div>
  );
}
