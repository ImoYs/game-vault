"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { fetchPopularGames } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const GENRES = ["action", "adventure", "role-playing-games-rpg", "strategy", "sports"];

export default function PopularGames() {
  const [gamesByGenre, setGamesByGenre] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const loadedGenres = useRef(new Set()); // ✅ Track already loaded genres

  useEffect(() => {
    const loadAllGenres = async () => {
      setLoading(true);
      const data = await Promise.all(
        GENRES.map(async (genre) => {
          if (loadedGenres.current.has(genre)) return { genre, results: gamesByGenre[genre] }; // ✅ Skip if already loaded
          const { results } = await fetchPopularGames(genre);
          loadedGenres.current.add(genre); // ✅ Mark genre as loaded
          return { genre, results };
        })
      );

      setGamesByGenre((prev) => {
        const newData = { ...prev };
        data.forEach(({ genre, results }) => {
          newData[genre] = results;
        });
        return newData;
      });

      setLoading(false);
    };

    loadAllGenres();
  }, []); // ✅ Empty dependency array to run only on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Popular Games</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        GENRES.map((genre) => (
          <div key={genre} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {genre.charAt(0).toUpperCase() + genre.slice(1)} Games
            </h2>

            {gamesByGenre[genre] && gamesByGenre[genre].length > 0 ? (
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={5}
                spaceBetween={20}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
              >
                {gamesByGenre[genre].map((game) => (
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
        ))
      )}
    </div>
  );
}
