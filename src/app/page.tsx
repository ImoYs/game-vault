//page.tsx
import Pgame from "@/components/game/Populargame";
import GameRelease from "@/components/game/GameRelease";
import Navbar from "@/components/Navbar/Navbar";
import Random from "@/components/game/Randomgame";
export default function HomePage() {
  return (
    <main>
      <Navbar/>
      <Random/>
      {/* <Pgame />
      <GameRelease/> */}
    </main>
  );
}
