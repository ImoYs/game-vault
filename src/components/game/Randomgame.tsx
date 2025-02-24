"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRandomGames } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Thumbs } from "swiper/modules";
import Gameimage from "@/components/game/Gameimage";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

export default function RandomGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<any>(null);

  useEffect(() => {
    const loadRandomGames = async () => {
      setLoading(true);
      const gameData = await fetchRandomGames(5);
      setGames(gameData);
      setActiveGame(gameData[0]); // Set the first game as active initially
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
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Main Game Image with Swiper */}
            <div className="w-full md:w-2/3 relative">
              <Swiper
                modules={[Autoplay, Pagination, Navigation, Thumbs]}
                slidesPerView={1}
                spaceBetween={20}
                loop={true}
                centeredSlides={true} // Ensures the active game is always centered
                pagination={{ clickable: true }}
                navigation={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                onSlideChange={(swiper) => setActiveGame(games[swiper.activeIndex])} // Update active game when slide changes
                className="pb-6"
              >
                {games.map((game) => (
                  <SwiperSlide key={game.id}>
                    <Link href={`/game/${game.id}`} className="block">
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
                        <img
                          src={game.background_image || "/default-image.jpg"}
                          alt={game.name}
                          className="w-full h-[400px] object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Game Details (Image of the active game) */}
            <div className="w-full md:w-1/3 flex flex-col justify-between">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">{activeGame?.name}</h2>
                {activeGame && <Gameimage gameId={activeGame.id} />}
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
