// app/games/page.tsx
import GameList from "@/components/game/GameList";
import Navbar from "@/components/Navbar/Navbar";

export default function GamesPage() {
  return (
    <main>
      <Navbar/>
      <h1><br></br></h1>
      <GameList />
    </main>
  );
}
