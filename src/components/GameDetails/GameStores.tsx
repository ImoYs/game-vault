// src\components\GameDetails\GameStores.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchGameStores, storeMapping  } from "@/utils/api/stores"; // ✅ ใช้ฟังก์ชันที่แยกไว้

interface GameStoresProps {
    gameId: string;
  }
  
  interface Store {
    id: number;
    game_id: string;
    store_id: number; // เปลี่ยนเป็น number เพื่อใช้กับ storeMapping
    url: string;
  }
  
  export default function GameStores({ gameId }: GameStoresProps) {
    const [stores, setStores] = useState<Store[]>([]);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchStores = async () => {
        try {
          const storesData = await fetchGameStores(gameId);
          setStores(storesData);
        } catch (err) {
          setError("Failed to load stores. Please try again later.");
        }
      };
      fetchStores();
    }, [gameId]);
  
    if (error) {
      return <p className="text-red-500">{error}</p>;
    }
  
    return (
      <section className="col-span-4 col-start-2 mt-6">
        <h3 className="font-bold text-lg">🛒 Available Stores</h3>
        {stores.length > 0 ? (
          <div className="flex flex-wrap gap-4 mt-4">
            {stores.map((store) => {
              const storeInfo = storeMapping[store.store_id];
  
              if (!storeInfo) return null; // ถ้าไม่มีข้อมูลร้านค้าให้ข้ามไป
  
              return (
                <a
                  key={store.id}
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  <img src={storeInfo.logo} alt={storeInfo.name} width={24} height={24} />
                  <span>{storeInfo.name}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No store links available</p>
        )}
      </section>
    );
  }