"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function PopularGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPopularGames = async () => {
      setLoading(true);
      try {
        const allGames = await fetchGames(1, 10);
        const sortedGames = allGames.sort((a: any, b: any) => b.rating - a.rating);
        setGames(sortedGames);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularGames();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">🔥Top 10 Games 🔥</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : games.length > 0 ? (
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
          {games.map((game) => (
            <SwiperSlide key={game.id} className="p-2">
              <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <Link href={`/game/${game.id}`} className="block">
                  <img
                    src={game.background_image || "/default-image.jpg"}
                    alt={game.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{game.name}</h3>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Rating:</span>
                      <span className="text-yellow-500 font-bold">{game.rating || "No rating"}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-lg text-gray-600">No games found</p>
      )}
    </div>
  );
}
