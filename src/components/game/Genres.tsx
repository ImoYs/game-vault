"use client";

import { useEffect, useState } from "react";
import { fetchGenres } from "@/utils/api/index";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function PopularGames() {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPopularGenres = async () => {
      setLoading(true);
      try {
        const allGenres = await fetchGenres(); // Fetch genres along with screenshots
        setGenres(allGenres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPopularGenres();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">🔥 Popular Genres 🔥</h1>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : genres.length > 0 ? (
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
          {genres.map((genre) => (
            <SwiperSlide key={genre.id} className="p-2">
              <div className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <a href={`/genres/${genre.name}`} className="block">
                  <img
                    src={genre.screenshots?.[0]?.image || "/default-image.jpg"} // Using first screenshot image if available
                    alt={genre.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{genre.name}</h3>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Description:</span> {genre.description || "No description available"}
                    </div>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-lg text-gray-600">No genres found</p>
      )}
    </div>
  );
}
