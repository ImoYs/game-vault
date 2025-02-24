"use client";

import { useEffect, useState, useRef } from "react";
import { fetchGameScreenshots, fetchGameTrailers } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

export default function GameMedia({ gameId }: { gameId: string }) {
  const [media, setMedia] = useState<any[]>([]);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [mainSwiper, setMainSwiper] = useState<any>(null); // Add state for main Swiper

  useEffect(() => {
    const fetchMedia = async () => {
      if (!gameId) return;
      try {
        const trailers = await fetchGameTrailers(gameId);
        const screenshots = await fetchGameScreenshots(gameId);

        const combinedMedia = [
          ...trailers.map((trailer: any) => ({
            type: "video",
            id: trailer.id,
            url: trailer.data.max,
            preview: trailer.preview,
          })),
          ...screenshots.map((screenshot: any) => ({
            type: "image",
            id: screenshot.id,
            url: screenshot.image,
          })),
        ];

        setMedia(combinedMedia);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchMedia();
  }, [gameId]);

  // No need for the preload useEffect, we'll handle it in onSlideChange

  if (!media.length) {
    return <p className="text-gray-400 text-center">No media available</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full aspect-video bg-black relative rounded-lg overflow-hidden shadow-lg">
        {/* Main Swiper (controlled by thumbs) */}
        <Swiper
          modules={[Navigation, Thumbs]}
          spaceBetween={10}
          navigation
          onSwiper={setMainSwiper} // Store the main Swiper instance
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null, // Check for destroyed
            multipleActiveThumbs: false,
          }}
          className="mySwiper2"
          onSlideChange={(swiper) => {
            // Pause all videos except the current one
            Object.keys(videoRefs.current).forEach((key) => {
              const video = videoRefs.current[parseInt(key, 10)];
              if (video && parseInt(key, 10) !== swiper.activeIndex) {
                video.pause();
              }
            });

            // Play the current video (if it's a video slide)
            const currentMedia = media[swiper.activeIndex];
            if (currentMedia?.type === "video") {
              const currentVideo = videoRefs.current[swiper.activeIndex];
              if (currentVideo) {
                currentVideo
                  .play()
                  .catch((error) => {
                    console.warn("Autoplay failed:", error); // Handle autoplay gracefully
                  });
              }
            }
          }}
        >
          {media.map((item, index) => (
            <SwiperSlide key={item.id}>
              {item.type === "video" ? (
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata" // Use "metadata"
                  onClick={(e) => { // Handle video click
                    if (mainSwiper) {
                        const video = e.target as HTMLVideoElement;
                        if(video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                    }
                  }}
                >
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={item.url}
                  alt={`Screenshot ${item.id}`}
                  className="w-full h-full object-cover"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbs Swiper */}
      <div className="w-full mt-4">
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={"auto"}
          spaceBetween={10}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
          navigation
          breakpoints={{
            320: {
              slidesPerView: 3,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 6, // Or 'auto'
              spaceBetween: 10,
            },
          }}
        >
          {media.map((item, index) => (
            <SwiperSlide
              key={item.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden aspect-video
                ${
                  thumbsSwiper &&
                  thumbsSwiper.activeIndex === index && // Check thumbsSwiper exists
                  "border-2 border-blue-500"
                }
                ${!thumbsSwiper && index === 0 && "border-2 border-blue-500"}`} // Initial active state
              onClick={() => { // Add click handler to thumbnails
                if (mainSwiper) {
                  mainSwiper.slideTo(index); // Go to the corresponding slide
                }
              }}
            >
              {item.type === "video" && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <span className="text-white text-2xl">▶</span>
                </div>
              )}
              {item.type === "video" ? (
                <img
                  src={item.preview}
                  alt={`Thumbnail ${item.id}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Thumbnail ${item.id}`}
                  className="w-full h-full object-cover"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}