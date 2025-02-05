// components/game/GameList.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { fetchGames, fetchGenres } from "@/utils/api";

export default function GameList() {
  const [games, setGames] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]); // เก็บข้อมูลประเภทเกม
  const [search, setSearch] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>(""); // สถานะเก็บประเภทเกมที่เลือก
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const pageSize = 20;
  const loadMoreRef = useRef(null);

  // ดึงข้อมูลเกมและประเภทเกม
  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      const newGames = await fetchGames(page, pageSize);
      setGames((prevGames) => [...prevGames, ...newGames]);
      setLoading(false);
    };

    const loadGenres = async () => {
      const genreData = await fetchGenres();
      setGenres(genreData); // เก็บประเภทเกมทั้งหมดในสถานะ
    };

    loadGames();
    loadGenres();
  }, [page]);

  useEffect(() => {
    const result = games.filter((game) => {
      const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = selectedGenre ? game.genres.some((genre: any) => genre.name.toLowerCase() === selectedGenre.toLowerCase()) : true;
      return matchesSearch && matchesGenre;
    });
    setFilteredGames(result);
  }, [search, games, selectedGenre]);

  // ตรวจจับการ scroll เพื่อโหลดข้อมูลเพิ่ม
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loading]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
        className="genre-select"
      >
        <option value="">Select Genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.name}>
            {genre.name}
          </option>
        ))}
      </select>
      <ul className="game-list">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <li key={game.id} className="game-item">
              <img
                src={game.background_image ? game.background_image : "/default-image.jpg"}
                alt={game.name}
                className="game-image"
              />
              <h3>{game.name}</h3>
            </li>
          ))
        ) : (
          <p>No games found</p>
        )}
      </ul>
      {loading && <p>Loading...</p>}
      <div ref={loadMoreRef} className="load-more-trigger"></div>
    </div>
  );
}
