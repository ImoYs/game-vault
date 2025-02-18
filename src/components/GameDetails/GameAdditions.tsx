"use client";

import { useState, useEffect } from "react";
import { fetchGameAdditions } from "@/utils/api/Additions"; // ✅ นำเข้า API ดึงข้อมูล DLC & Editions
import { useParams } from "next/navigation";
import Link from "next/link"; // ใช้ Link ของ Next.js

export default function GameAdditions() {
  const { id } = useParams();
  const [additions, setAdditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdditionsData = async () => {
      if (!id) return;
      try {
        const response = await fetchGameAdditions(id);
        setAdditions(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching game additions:", error);
        setLoading(false);
      }
    };

    fetchAdditionsData();
  }, [id]);

  if (loading) {
    return <p>Loading DLC & Editions...</p>;
  }

  return (
    <div>
      <h3 className="font-bold text-lg">🎮 DLC & Editions</h3>
      {additions.length === 0 ? (
        <p>No DLC or special editions available.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {additions.map((addition) => (
            <div key={addition.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <img src={addition.background_image} alt={addition.name} className="w-full h-32 object-cover rounded-md" />
              <h4 className="font-semibold mt-2">{addition.name}</h4>
              <p className="text-sm text-gray-600">Released: {addition.released || "TBA"}</p>
              <p className="text-sm text-gray-600">Metacritic: {addition.metacritic ?? "N/A"}</p>
              <p className="text-sm text-gray-600">Platforms: {addition.platforms.map((p: any) => p.platform.name).join(", ")}</p>
              
              {/* เพิ่มปุ่มลิงก์ไปยังหน้าเกม DLC */}
              <Link href={`/game/${addition.id}`} className="text-blue-500 hover:underline mt-2 inline-block">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
