"use client";
import Navbar from "@/components/Navbar/Navbar";  // นำเข้า Navbar
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ใช้ useParams เพื่อดึงค่า genre จาก URL
import Link from "next/link";
import { fetchGamesgenre } from "@/utils/api/gamegenres"; // ฟังก์ชันดึงข้อมูลเกมตาม genre
import TopGenresgame from "@/components/game/TopGenresgame";



export default function Gamesgenre() {
  const [games, setGames] = useState([]); // สถานะเก็บข้อมูลเกม
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [page, setPage] = useState(1); // หน้าเริ่มต้น
  const [hasMore, setHasMore] = useState(true); // ตรวจสอบว่ามีข้อมูลเพิ่มเติมหรือไม่
  const [searchQuery, setSearchQuery] = useState(""); // สถานะเก็บคำค้นหา
  const { id } = useParams(); // ดึงค่า genre จาก URL เช่น "rpg"
  const selectedGenre = id || "action"; // ถ้าไม่มี genre ให้ใช้ "action" เป็นค่าเริ่มต้น

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลเกมจาก API โดยใช้ genre และหน้า
        const { results } = await fetchGamesgenre(selectedGenre.toLowerCase(), page);
        if (results.length === 0) setHasMore(false);

        // ตรวจสอบไม่ให้มีเกมซ้ำ โดยใช้ id ของเกม
        setGames((prevGames) => {
          const newGames = [...prevGames, ...results];
          const uniqueGames = Array.from(new Set(newGames.map(game => game.id))) // กรองเกมที่ซ้ำ
            .map(id => newGames.find(game => game.id === id)); // หามาใหม่จาก id
          return uniqueGames;
        });
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGenre) loadGames(); // เรียกฟังก์ชันเมื่อ genre ถูกกำหนด
  }, [selectedGenre, page]);

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) // กรองเกมตามคำค้นหา
  );

  if (loading && games.length === 0) return <p className="text-center">Loading...</p>;

  return (
    <div>
      {/* เพิ่ม Navbar ที่นี่ */}
      
      <Navbar />
      {/* <TopGenresgame genre={selectedGenre} /> */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Popular {selectedGenre.toUpperCase()} Games
        </h1>
        
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games by name"
            className="p-2 border border-gray-300 rounded-lg w-1/2"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
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
            <p className="text-center text-lg text-gray-600">No games found</p>
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
