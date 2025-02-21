"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { fetchPopularGames } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const GENRES = [
  { key: "action", label: "Action" },
  { key: "adventure", label: "Adventure" },
  { key: "role-playing-games-rpg", label: "RPG" },
  { key: "strategy", label: "Strategy" },
  { key: "sports", label: "Sports" }
];

export default function PopularGames() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const { genre } = router.query;

    if (!genre || typeof genre !== "string") return;

    const isValidGenre = GENRES.some((g) => g.key === genre);
    if (!isValidGenre) return;

    const loadGames = async () => {
      setLoading(true);
      try {
        const { results } = await fetchPopularGames(genre);
        setGames(results);
      } catch (error) {
        console.error("Error fetching popular games:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [isClient, router.query]);

  if (!isClient) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Popular Games in {GENRES.find((g) => g.key === router.query.genre)?.label || "Unknown Genre"}
      </h1>

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
  );
}
