"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPopularGames } from "@/utils/api"; // ใช้ API fetchPopularGames
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function PopularGames() {
  const [games, setGames] = useState<any[]>([]);
  const [month, setMonth] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPopularGames = async () => {
      setLoading(true);
      const { results, month, year } = await fetchPopularGames();
      setGames(results);
      setMonth(
        ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month]
      );
      setYear(year);
      setLoading(false);
    };

    loadPopularGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {month && year && (
        <h1 className="text-3xl font-bold text-center mb-6">
          Popular Games Released in {month} {year}
        </h1>
      )}

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
