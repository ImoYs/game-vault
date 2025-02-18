"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames, fetchGenres } from "@/utils/api/index";

export default function GameList() {
  const [games, setGames] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pageSize = 20;

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const newGames = await fetchGames(page, pageSize);
        if (newGames.length < pageSize) setHasMore(false);

        setGames((prevGames) => {
          const allGames = [...prevGames, ...newGames];
          return Array.from(new Set(allGames.map((game) => game.id))).map((id) =>
            allGames.find((game) => game.id === id)
          );
        });
      } catch (error) {
        console.error("Error fetching games:", error);
      }
      setLoading(false);
    };

    loadGames();
  }, [page]);

  // ✅ โหลดประเภทเกม (Genres)
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres();
        console.log("Fetched Genres:", genreData);
        setGenres(genreData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    loadGenres();
  }, []);

  // ✅ กรองเกมตามประเภทและชื่อ
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre
      ? game.genres?.some((genre: any) => genre.name.toLowerCase() === selectedGenre.toLowerCase())
      : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container mx-auto p-6">
      {/* 🔍 ค้นหาเกม */}
      <form className="max-w-3xl mx-auto flex space-x-4">
        <div className="relative w-full">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full p-4 text-sm text-white border border-black rounded-lg bg-black"
            placeholder="Search games..."
          />
        </div>

        {/* 🔽 เลือกประเภทเกม */}
        <div className="relative w-44">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="block w-full p-4 text-sm text-white border border-black rounded-lg bg-black"
          >
            <option value="">All Genres</option>
            {genres.length > 0 ? (
              genres.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))
            ) : (
              <option disabled>Loading Genres...</option>
            )}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setSearch(searchInput)}
          className="text-white bg-black hover:bg-gray-800 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </form>

      {/* 🔹 รายชื่อเกม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="bg-white p-0 rounded shadow-2xl">
              <Link href={`/game/${game.id}`}>
                <div className="relative">
                  <img
                    src={game.background_image || "/default-image.jpg"}
                    alt={game.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
                <h3 className="text-center font-bold mt-2 text-gray-900">{game.name}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">No games found</p>
        )}
      </div>

      {/* 🔻 ปุ่ม Load More */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
