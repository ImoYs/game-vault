"use client";
import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchGamesgenre } from "@/utils/api/gamegenres";
import TopGenresgame from "@/components/game/TopGenresgame";

export default function Gamesgenre() {
  const [games, setGames] = useState([]); // เก็บข้อมูลเกมทั้งหมด
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const selectedGenre = id || "action";

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const { results } = await fetchGamesgenre(selectedGenre.toLowerCase(), page);
        if (results.length === 0) setHasMore(false);

        setGames((prevGames) => {
          const newGames = [...prevGames, ...results];
          const uniqueGames = Array.from(new Set(newGames.map(game => game.id)))
            .map(id => newGames.find(game => game.id === id));
          return uniqueGames;
        });
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedGenre) loadGames();
  }, [selectedGenre, page]);

  // ดึง 5 เกมแรกเป็นเกมแนะนำ
  const topRecommendedGames = games.slice(0, 5);

  // กรองเกมตามคำค้นหา
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && games.length === 0) return <p className="text-center">Loading...</p>;

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Popular {selectedGenre.toUpperCase()} Games
        </h1>

        {/* **เพิ่ม Top Recommended Games ด้านบน** */}
        {topRecommendedGames.length > 0 && (
          <TopGenresgame games={topRecommendedGames} />
        )}

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

        {/* Grid แสดงรายการเกม */}
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

        {/* Load More Button */}
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
