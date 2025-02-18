"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames } from "@/utils/api/index"; // ใช้ API fetchGames
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules"; // นำเข้าโมดูลที่จำเป็น
import "swiper/css"; // สไตล์พื้นฐานของ Swiper
import "swiper/css/pagination"; // สไตล์ Pagination
import "swiper/css/navigation"; // สไตล์ Navigation

export default function PopularGames() {
  const [games, setGames] = useState<any[]>([]); // เก็บข้อมูลเกมที่เรียงแล้ว
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPopularGames = async () => {
      setLoading(true);
      try {
        const allGames = await fetchGames(1, 10); // ดึง 10 เกมจาก API
        const sortedGames = allGames.sort((a: any, b: any) => {
          return b.rating - a.rating; // เรียงเกมจากคะแนนสูงสุดไปต่ำสุด
        });
        setGames(sortedGames); // ตั้งค่าเกมที่เรียงแล้ว
      } catch (error) {
        console.error("Error fetching games:", error); // ตรวจสอบข้อผิดพลาดจาก API
      } finally {
        setLoading(false);
      }
    };

    loadPopularGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Top 10 Games (Sorted by Rating)</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : games.length > 0 ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]} // เปิดใช้งานโมดูล
          slidesPerView={4} // แสดง 4 เกมต่อรอบ
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
                    className="w-full h-64 object-cover" // กำหนดความสูงภาพให้เหมาะสม
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{game.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {game.description || "No description available."}
                    </p>
                    <div className="mt-2 flex items-center">
                      <span className="font-semibold text-gray-700 mr-2">Rating:</span>
                      <span className="text-yellow-500">{game.rating || "No rating"}</span> {/* แสดง rating */}
                    </div>
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
