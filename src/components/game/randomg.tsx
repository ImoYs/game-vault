"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames } from "@/utils/api"; // ใช้ API fetchGames
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // นำเข้าโมดูลที่จำเป็น
import "swiper/css"; // สไตล์พื้นฐานของ Swiper
import "swiper/css/pagination"; // สไตล์ Pagination
import "swiper/css/navigation"; // สไตล์ Navigation

export default function RandomGames() {
  const [games, setGames] = useState<any[]>([]); // เก็บข้อมูลเกมที่สุ่มได้
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRandomGames = async () => {
      setLoading(true);
      const allGames = await fetchGames(1, 50); // ดึงเกมทั้งหมด (หรือ 50 เกมแรก)
      const shuffledGames = allGames.sort(() => 0.5 - Math.random()); // สุ่มเกม
      setGames(shuffledGames.slice(0, 5)); // เลือก 5 เกมแรกจากที่สุ่มได้
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
          modules={[Autoplay, Pagination, Navigation]} // เปิดใช้งานโมดูล
          slidesPerView={1} // แสดงทีละ 1 เกม
          spaceBetween={20} // ระยะห่างระหว่างสไลด์
          loop={true} // ให้วนซ้ำ
          autoplay={{
            delay: 3000, // เลื่อนอัตโนมัติทุก 3 วินาที
            disableOnInteraction: false, // เล่นต่อหลังจากผู้ใช้โต้ตอบ
          }}
          pagination={{ clickable: true }} // เพิ่ม Pagination ที่คลิกได้
          navigation={true} // เพิ่มปุ่ม Next และ Previous
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
                      {game.description || "No description available."}
                    </p>
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
