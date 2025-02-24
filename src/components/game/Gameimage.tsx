"use client";

import { useEffect, useState } from "react";
import { fetchGameScreenshots } from "@/utils/api/index";

export default function GameMedia({ gameId }: { gameId: string }) {
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!gameId) return;
      try {
        const screenshots = await fetchGameScreenshots(gameId);
        const formattedScreenshots = screenshots.map((screenshot: any) => ({
          type: "image",
          id: screenshot.id,
          url: screenshot.image,
        }));
        setMedia(formattedScreenshots);
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mt-4">
        {media.slice(0, 4).map((item) => (
          <div key={item.id} className="relative rounded-lg overflow-hidden aspect-video">
            <img
              src={item.url}
              alt={`Screenshot ${item.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
