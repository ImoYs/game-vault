"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames, fetchGenres } from "@/utils/api";

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
    const loadGenres = async () => {
      const genreData = await fetchGenres();
      setGenres(genreData);
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      const newGames = await fetchGames(page, pageSize);

      if (newGames.length < pageSize) {
        setHasMore(false);
      }

      setGames((prevGames) => [...prevGames, ...newGames]);
      setLoading(false);
    };

    loadGames();
  }, [page]);

  // กรองเกมตามเงื่อนไข
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre ? game.genres.some((genre: any) => genre.name.toLowerCase() === selectedGenre.toLowerCase()) : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container mx-auto p-6">
      {/* 🔍 ค้นหาเกม */}
      <form className="max-w-3xl mx-auto flex space-x-4">
        <div className="relative w-full">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-white border border-black rounded-lg bg-black focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-black dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search games..."
            required
          />
        </div>

        {/* 🔽 เลือกประเภทเกม */}
        <div className="relative w-44">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="block w-full p-4 text-sm text-white border border-black rounded-lg bg-black focus:ring-blue-500 focus:border-blue-500 dark:bg-black dark:border-black dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setSearch(searchInput)}
          className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-black dark:hover:bg-gray-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </form>


      {/* 🔹 รายชื่อเกมแบบ Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="bg-white p-0 rounded shadow-2xl">
              <Link href={`/game/${game.id}`} className="group">
                <div className="relative">
                  {/* รูปภาพ */}
                  <img
                    src={game.background_image || "/default-image.jpg"}
                    alt={game.name}
                    className="w-full h-48 object-cover rounded group-hover:opacity-80 transition-opacity"
                  />
                </div>
                {/* ชื่อเกม */}
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
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
