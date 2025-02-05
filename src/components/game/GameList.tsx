"use client";

import { useEffect, useState } from "react";
import { fetchGames } from "@/utils/api";

export default function GameList() {
  const [games, setGames] = useState<any[]>([]);

  useEffect(() => {
    fetchGames().then(setGames).catch(console.error);
  }, []);

  return (
    <div>
      <h2>🎮 Game List</h2>
      <ul>
        {games.length > 0 ? (
          games.map((game) => <li key={game.id}>{game.name}</li>)
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  );
}
