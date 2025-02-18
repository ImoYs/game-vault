"use client";

import { useState, useEffect } from "react";
import { fetchGameTrailers } from "@/utils/api"; // ✅ นำเข้า API ดึงข้อมูล Trailer

interface GameTrailersProps {
  gameId: string;
}

export default function GameTrailers({ gameId }: GameTrailersProps) {
  const [trailers, setTrailers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrailers = async () => {
      const trailersData = await fetchGameTrailers(gameId);
      setTrailers(trailersData);
    };
    fetchTrailers();
  }, [gameId]);

  return (
    <section className="col-span-4 col-start-2 mt-6">
      <h3 className="font-bold text-lg">🎬 Game Trailers</h3>
      {trailers.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {trailers.map((trailer) => (
            <div key={trailer.id} className="w-full md:w-1/2 lg:w-1/3">
              {trailer.data?.max ? ( // 🔹 ถ้ามีไฟล์วิดีโอให้เล่น
                <video controls className="w-full rounded-lg shadow-md">
                  <source src={trailer.data.max} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : ( // 🔹 ถ้าไม่มีวิดีโอ ให้แสดง preview image
                <img src={trailer.preview} alt={trailer.name} className="w-full rounded-lg shadow-md" />
              )}
              <p className="text-sm text-gray-600">{trailer.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No trailers available</p>
      )}
    </section>
  );
}
