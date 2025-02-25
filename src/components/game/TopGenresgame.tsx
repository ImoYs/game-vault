"use client";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function TopGenresgame({ games }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGame = games[activeIndex]; // เกมที่เลือกอยู่ปัจจุบัน

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">🔥 Recommended Games</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section: Main Game Image & Swiper */}
        <div className="w-full md:w-2/3 relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            centeredSlides={true}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // Update activeIndex
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

        {/* Right Section: Screenshots & Game Info */}
        <div className="w-full md:w-1/3 flex flex-col">
          <h2 className="text-xl font-semibold mb-3 text-center md:text-left">{activeGame?.name}</h2>
          <div className="grid grid-cols-2 gap-2">
            {activeGame?.screenshots?.slice(0, 4).map((screenshot, index) => (
              <img
                key={index}
                src={screenshot.image}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
