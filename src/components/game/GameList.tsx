"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames, fetchGenres } from "@/utils/api/index";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

export default function GameList() {
  const [games, setGames] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    loadGenres();
  }, []);

  return loading ? <LoadingSkeleton /> : <GameListContent games={games} genres={genres} hasMore={hasMore} setPage={setPage} />;
}

function GameListContent({ games, genres, hasMore, setPage }: { games: any[]; genres: any[]; hasMore: boolean; setPage: (value: any) => void }) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre
      ? game.genres?.some((genre: any) => genre.name.toLowerCase() === selectedGenre.toLowerCase())
      : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4">Game List</h1>

      <form className="max-w-3xl mx-auto flex space-x-4 mb-6">
        <div className="relative w-full">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setSearch(searchInput);
              }
            }}
            className="block w-full p-4 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search games..."
          />
        </div>

        <div className="relative w-44">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="block w-full p-4 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
              <Link href={`/game/${game.id}`}>
                <div className="relative">
                  <img
                    src={game.background_image || "/default-image.jpg"}
                    alt={game.name}
                    className="w-full h-48 object-cover rounded-t-lg transition duration-300 hover:brightness-75"
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

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev: number) => prev + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
