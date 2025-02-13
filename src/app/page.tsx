//page.tsx
import Pgame from "@/components/game/Populargame";
// import GameRelease from "@/components/game/GameRelease";
import Navbar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/Navbar/NavSidebar";
import Random from "@/components/game/randomg";
export default function HomePage() {
  return (
    <main>
      <Navbar/>
      <NavSidebar/>
      <h1>🔥 Top 10 Games</h1>
      <Random/>
      <Pgame />
      {/* <GameRelease/> */}
    </main>
  );
}
