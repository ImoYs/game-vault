// \src\utils\api.ts

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export const fetchGameDevelopmentTeam = async (gameId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}/development-team?key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch development team");
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching development team:", error);
    return [];
  }
};
