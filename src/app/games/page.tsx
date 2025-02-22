// app/games/page.tsx
"use client"; // เพิ่มบรรทัดนี้

import { useState, useEffect } from "react";
import GameList from "@/components/game/GameList";
import Navbar from "@/components/Navbar/Navbar";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton"; // เพิ่มไฟล์ Skeleton

export default function GamesPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // จำลองการโหลดข้อมูล (เช่น ดึงข้อมูล API จริง)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main>
      <Navbar />
      <h1><br></br></h1>
      {loading ? <LoadingSkeleton /> : <GameList />}
    </main>
  );
}
