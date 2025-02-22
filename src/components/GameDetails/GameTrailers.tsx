"use client";

import { useEffect, useState, useRef } from "react";
import { fetchGameScreenshots, fetchGameTrailers } from "@/utils/api/index";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function GameMedia({ gameId }: { gameId: string }) {
  const [media, setMedia] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const swiper = useSwiper(); // Call useSwiper unconditionally at the top

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

  useEffect(() => {
    if (media.length > 0 && media[activeIndex].type === "video") {
      const nextIndex = activeIndex + 1;
      if (media[nextIndex] && media[nextIndex].type === "video") {
        const videoElement = videoRefs.current[nextIndex];
        if (videoElement) {
          videoElement.load();
        }
      }
    }
  }, [activeIndex, media]);



  // Early return if no media.  Hooks are called *before* this.
  if (!media.length) {
    return <p className="text-gray-400 text-center">No media available</p>;
  }


  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full aspect-video bg-black relative rounded-lg overflow-hidden shadow-lg">
        {media[activeIndex].type === "video" ? (
          <video
            ref={(el) => (videoRefs.current[activeIndex] = el)}
            key={media[activeIndex].id}
            className="w-full h-full object-cover"
            controls
            preload="auto"
            autoPlay
          >
            <source src={media[activeIndex].url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={media[activeIndex].url}
            alt={`Screenshot ${media[activeIndex].id}`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="w-full mt-4">
        <Swiper
          slidesPerView={3}
          spaceBetween={8}
          navigation
          freeMode
          breakpoints={{
            480: { slidesPerView: 4, spaceBetween: 10 },
            640: { slidesPerView: 5, spaceBetween: 10 },
            768: { slidesPerView: 6, spaceBetween: 12 },
            1024: { slidesPerView: 8, spaceBetween: 16 },
            1280: { slidesPerView: 10, spaceBetween: 20 },
          }}
          className="w-full"
          modules={[Navigation, FreeMode]} // Important: Add the modules here
        >
          {media.map((item, index) => {
            // Calculate the style *outside* the button, but *after* useSwiper
            const buttonStyle = swiper
              ? {
                  width: `calc((100% / ${swiper.params.slidesPerView}) - ${swiper.params.spaceBetween}px)`,
                  height: "auto",
                  paddingBottom: item.type === "video" ? "56.25%" : "0",
                }
              : {};

            return (
              <SwiperSlide key={item.id}>
                <button
                  onClick={() => setActiveIndex(index)}
                  className={`relative rounded-lg overflow-hidden transition-all ${
                    activeIndex === index
                      ? "border-2 border-blue-500 scale-105"
                      : "border border-transparent"
                  }`}
                  style={buttonStyle} // Use the pre-calculated style
                >
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                      <span className="text-white text-2xl">▶</span>
                    </div>
                  )}
                  {item.type === "video" ? (
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${item.id}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}