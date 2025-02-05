import { fetchGames } from "@/utils/api";

export default async function ApiTestPage() {
  const data = await fetchGames();

  if (!data) {
    return <p className="text-red-500">Failed to fetch data</p>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">API Test Page</h1>
      <ul>
        {data.results.map((game: any) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  );
}
