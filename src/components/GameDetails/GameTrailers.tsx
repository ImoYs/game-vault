"use client";

import { useEffect, useState, useRef } from "react";
import { fetchGameScreenshots, fetchGameTrailers } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GameMedia({ gameId }: { gameId: string }) {
  const [media, setMedia] = useState<any[]>([]);
  const swiperRef = useRef<any>(null); // สร้าง useRef เพื่ออ้างอิงไปยัง Swiper หลัก
  const [activeVideo, setActiveVideo] = useState<number | null>(null); // เก็บข้อมูลว่าวิดีโอไหนกำลังเล่นอยู่

  useEffect(() => {
    const fetchMedia = async () => {
      if (!gameId) return;
      try {
        const trailers = await fetchGameTrailers(gameId);
        const screenshots = await fetchGameScreenshots(gameId);

        const combinedMedia = [
          ...trailers.map((trailer: any) => ({ type: "video", id: trailer.id, url: trailer.data.max })),
          ...screenshots.map((screenshot: any) => ({ type: "image", id: screenshot.id, url: screenshot.image })),
        ];

        setMedia(combinedMedia);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchMedia();
  }, [gameId]);

  if (!media.length) {
    return <p className="text-gray-400 text-center">No media available</p>;
  }

  return (
    <div className="w-full">
      {/* Main Swiper for images/videos */}
      <div className="w-full h-72 lg:h-96 mb-4">
        <Swiper
          ref={swiperRef} // ใช้ ref ที่สร้างไว้
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
          {media.map((item, index) => (
            <SwiperSlide key={item.id} className="flex justify-center items-center">
              {item.type === "video" ? (
                <div className="relative w-full h-full">
                  {activeVideo === index ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`${item.url}?autoplay=1`}
                      title={`Trailer ${item.id}`}
                      allowFullScreen
                      className="rounded-lg shadow-lg"
                    />
                  ) : (
                    <button
                      onClick={() => setActiveVideo(index)} // คลิกเพื่อเล่นวิดีโอ
                      className="absolute inset-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center text-white text-2xl"
                    >
                      Play
                    </button>
                  )}
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={`Screenshot ${item.id}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg" // รูปแบบสี่เหลี่ยมผืนผ้า
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Swiper */}
      <div className="w-full h-24 mb-4">
        <Swiper
          slidesPerView={5}
          spaceBetween={10}
          className="w-full h-full"
          breakpoints={{
            640: {
              slidesPerView: 5,
            },
            768: {
              slidesPerView: 7,
            },
            1024: {
              slidesPerView: 10,
            },
          }}
        >
          {media.map((item, index) => (
            <SwiperSlide key={item.id} className="flex justify-center items-center">
              <button
                onClick={() => {
                  if (swiperRef.current) {
                    const slideIndex = media.findIndex((mediaItem) => mediaItem.id === item.id);
                    swiperRef.current.swiper.slideTo(slideIndex); // ใช้ swiperRef เพื่อเปลี่ยนสไลด์
                  }
                }}
                className="w-20 h-14 bg-black bg-opacity-90 rounded-lg overflow-hidden shadow-md flex justify-center items-center" // เพิ่ม flex เพื่อจัดกึ่งกลาง
              >
                {item.type === "video" ? (
                  <div className="w-full h-full">
                    {/* Thumbnail video ไม่มีข้อความ "Video" แล้ว */}
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={`Screenshot ${item.id}`}
                    className="object-cover w-full h-full" // ปรับให้ภาพครอบคลุมเต็ม button
                  />
                )}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
}
