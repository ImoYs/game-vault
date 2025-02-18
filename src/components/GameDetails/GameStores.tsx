"use client";

import { useState, useEffect } from "react";
import { fetchGameStores } from "@/utils/fetchGameStores"; // ✅ นำเข้า API ดึงข้อมูลร้านค้า

interface GameStoresProps {
  gameId: string;
}

export default function GameStores({ gameId }: GameStoresProps) {
  const [stores, setStores] = useState<any[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      const storesData = await fetchGameStores(gameId);
      setStores(storesData);
    };
    fetchStores();
  }, [gameId]);

  return (
    <section className="col-span-4 col-start-2 mt-6">
      <h3 className="font-bold text-lg">🛒 Available Stores</h3>
      {stores.length > 0 ? (
        <ul className="list-disc list-inside">
          {stores.map((store) => (
            <li key={store.id}>
              <a
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {store.store.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No store links available</p>
      )}
    </section>
  );
}
