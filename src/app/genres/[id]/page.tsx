"use client";
import Navbar from "@/components/Navbar/Navbar";  // นำเข้า Navbar
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ใช้ useParams เพื่อดึงค่า genre จาก URL
import Link from "next/link";
import { fetchGamesgenre } from "@/utils/api/gamegenres"; // ฟังก์ชันดึงข้อมูลเกมตาม genre

export default function Gamesgenre() {
  const [games, setGames] = useState([]); // สถานะเก็บข้อมูลเกม
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [page, setPage] = useState(1); // หน้าเริ่มต้น
  const [hasMore, setHasMore] = useState(true); // ตรวจสอบว่ามีข้อมูลเพิ่มเติมหรือไม่
  const { id } = useParams(); // ดึงค่า genre จาก URL เช่น "rpg"
  const selectedGenre = id || "action"; // ถ้าไม่มี genre ให้ใช้ "action" เป็นค่าเริ่มต้น

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลเกมจาก API โดยใช้ genre และหน้า
        const { results } = await fetchGamesgenre(selectedGenre.toLowerCase(), page);
        if (results.length === 0) setHasMore(false);
        setGames((prevGames) => [...prevGames, ...results]); // เพิ่มเกมใหม่เข้าไป
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGenre) loadGames(); // เรียกฟังก์ชันเมื่อ genre ถูกกำหนด
  }, [selectedGenre, page]);

  if (loading && games.length === 0) return <p className="text-center">Loading...</p>;

  return (
    <div>
      {/* เพิ่ม Navbar ที่นี่ */}
      <Navbar />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Popular {selectedGenre.toUpperCase()} Games
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.length > 0 ? (
            games.map((game) => (
              <div key={game.id} className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <Link href={`/game/${game.id}`} className="block">
                  <img
                    src={game.background_image || "/default-image.jpg"}
                    alt={game.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{game.name}</h3>
                    <p className="text-md text-gray-700 mt-2">
                      ⭐ Rating: {game.rating ? game.rating.toFixed(1) : "N/A"} / 5
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-lg text-gray-600">No popular games found</p>
          )}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setPage((prevPage) => prevPage + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
