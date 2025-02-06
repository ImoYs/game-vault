// infinite scroll
// "use client";

// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { fetchGames, fetchGenres } from "@/utils/api";

// export default function GameList() {
//   const [games, setGames] = useState<any[]>([]);
//   const [genres, setGenres] = useState<any[]>([]);
//   const [search, setSearch] = useState<string>("");
//   const [selectedGenre, setSelectedGenre] = useState<string>("");
//   const [filteredGames, setFilteredGames] = useState<any[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const [loading, setLoading] = useState<boolean>(false);

//   const pageSize = 20;
//   const loadMoreRef = useRef(null);

//   useEffect(() => {
//     const loadGames = async () => {
//       setLoading(true);
//       const newGames = await fetchGames(page, pageSize);
//       setGames((prevGames) => [...prevGames, ...newGames]);
//       setLoading(false);
//     };

//     const loadGenres = async () => {
//       const genreData = await fetchGenres();
//       setGenres(genreData);
//     };

//     loadGames();
//     loadGenres();
//   }, [page]);

//   useEffect(() => {
//     const result = games.filter((game) => {
//       const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
//       const matchesGenre = selectedGenre ? game.genres.some((genre: any) => genre.name.toLowerCase() === selectedGenre.toLowerCase()) : true;
//       return matchesSearch && matchesGenre;
//     });
//     setFilteredGames(result);
//   }, [search, games, selectedGenre]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !loading) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       },
//       {
//         rootMargin: "200px",
//       }
//     );

//     if (loadMoreRef.current) {
//       observer.observe(loadMoreRef.current);
//     }

//     return () => {
//       if (loadMoreRef.current) {
//         observer.unobserve(loadMoreRef.current);
//       }
//     };
//   }, [loading]);

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search games..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="search-bar"
//       />
//       <select
//         value={selectedGenre}
//         onChange={(e) => setSelectedGenre(e.target.value)}
//         className="genre-select"
//       >
//         <option value="">Select Genre</option>
//         {genres.map((genre) => (
//           <option key={genre.id} value={genre.name}>
//             {genre.name}
//           </option>
//         ))}
//       </select>

//       <ul className="game-list">
//         {filteredGames.length > 0 ? (
//           filteredGames.map((game) => (
//             <li key={game.id} className="game-item">
//               <Link href={`/game/${game.id}`}>
//                 <img
//                   src={game.background_image ? game.background_image : "/default-image.jpg"}
//                   alt={game.name}
//                   className="game-image"
//                 />
//                 <h3>{game.name}</h3>
//               </Link>
//             </li>
//           ))
//         ) : (
//           <p>No games found</p>
//         )}
//       </ul>
      
//       {loading && <p>Loading...</p>}
//       <div ref={loadMoreRef} className="load-more-trigger"></div>
//     </div>
//   );
// }



//Load More
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGames, fetchGenres } from "@/utils/api";

export default function GameList() {
  const [games, setGames] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
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
        setHasMore(false); // ถ้าโหลดมาไม่เต็ม pageSize แสดงว่าไม่มีเกมให้โหลดเพิ่ม
      }

      setGames((prevGames) => [...prevGames, ...newGames]);
      setLoading(false);
    };

    loadGames();
  }, [page]);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre ? game.genres.some((genre: any) => genre.name.toLowerCase() === selectedGenre.toLowerCase()) : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="genre-select">
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <ul className="game-list">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <li key={game.id} className="game-item">
              <Link href={`/game/${game.id}`}>
                <img src={game.background_image || "/default-image.jpg"} alt={game.name} className="game-image" />
                <h3>{game.name}</h3>
              </Link>
            </li>
          ))
        ) : (
          <p>No games found</p>
        )}
      </ul>

      {hasMore && (
        <button onClick={() => setPage((prev) => prev + 1)} disabled={loading} className="load-more-btn">
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
