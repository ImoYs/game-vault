//page.tsx
import Pgame from "@/components/game/Populargame";
import Navbar from "@/components/Navbar/Navbar";
import NavSidebar from "@/components/Navbar/NavSidebar";
export default function HomePage() {
  return (
    <main>
      <Navbar/>
      <NavSidebar/>
      <h1>🔥 Popular Games</h1>
      <Pgame />
    </main>
  );
}
