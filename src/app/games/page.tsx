// app/games/page.tsx
import GameList from "@/components/game/GameList";
import Navbar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/Navbar/NavSidebar";
export default function GamesPage() {
  return (
    <main>
      <Navbar/>
      <NavSidebar/>
      <h1>🔥 All Games</h1>
      <GameList />
    </main>
  );
}
