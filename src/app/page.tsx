// src/app/page.tsx
import { getGames } from '@/utils/api';
import GameCard from '@/components/game/GameCard';

async function HomePage() {
  const games = await getGames();

  return (
    <main>
      <h1>เกมแนะนำ</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
}

export default HomePage;