// app/games/page.tsx
import GameList from "@/components/game/GameList";
import Navbar from "@/components/Navbar/Navbar";

export default function GamesPage() {
  return (
    <main>
      <Navbar/>
      
      <h1>🔥 All Games</h1>
      <GameList />
    </main>
  );
}
