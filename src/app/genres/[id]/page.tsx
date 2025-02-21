"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ใช้ useParams เพื่อดึงค่า genre จาก URL
import Link from "next/link";
import { fetchGamesgenre } from "@/utils/api/gamegenres"; // ฟังก์ชันดึงข้อมูลเกมตาม genre
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Gamesgenre() {
  const [games, setGames] = useState([]); // สถานะเก็บข้อมูลเกม
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const { id } = useParams(); // ดึงค่า genre จาก URL เช่น "rpg"
  const selectedGenre = id || "action"; // ถ้าไม่มี genre ให้ใช้ "rpg" เป็นค่าเริ่มต้น

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลเกมจาก API โดยใช้ genre ที่ได้รับจาก URL
        const { results } = await fetchGamesgenre(selectedGenre.toLowerCase());
        setGames(results); // กำหนดผลลัพธ์ที่ได้จาก API
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGenre) loadGames(); // เรียกฟังก์ชันเมื่อ genre ถูกกำหนด
  }, [selectedGenre]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Popular {selectedGenre.toUpperCase()} Games
      </h1>
      <div>
        {games.length > 0 ? (
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
    </div>
  );
}
