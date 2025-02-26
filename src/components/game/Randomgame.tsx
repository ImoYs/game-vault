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
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGame = games[activeIndex];
  const truncatedDescription = activeGame?.description_raw?.slice(0, 200) || "";

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
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-black">🎮 Random Games 🎮</h1>

      {loading ? (
        <p className="text-center text-white text-lg">Loading...</p>
      ) : games.length > 0 ? (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 relative">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                slidesPerView={1}
                spaceBetween={20}
                loop={true}
                centeredSlides={true}
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ delay: 10000, disableOnInteraction: false }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="pb-6"
              >
                {games.map((game) => (
                  <SwiperSlide key={game.id}>
                    <Link href={`/game/${game.id}`} className="block">
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
                        <img
                          src={game.background_image || "/default-image.jpg"}
                          alt={game.name}
                          className="w-full h-[450px] object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="w-full md:w-1/3 flex flex-col">
              <h2 className="text-xl font-semibold mb-3 text-center md:text-left">{activeGame?.name}</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {activeGame?.screenshots?.slice(0, 4).map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot.image}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
              <p>
                {truncatedDescription}
                {activeGame?.description_raw?.length > 200 && (
                  <Link href={`/game/${activeGame.id}`} className="text-blue-500 ml-1">More details</Link>
                )}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {activeGame?.tags?.slice(0, 3).map((tag, index) => (
                  <span key={index} className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-white text-lg">No games found</p>
      )}
    </div>
  );
}
