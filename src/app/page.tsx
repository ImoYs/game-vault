//page.tsx
import GameList from "@/components/game/GameList";
import Navbar from "@/components/Navbar/Navbar";
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <h1>🔥 Popular Games</h1>
      {/* <GameList /> */}
    </main>
  );
}
