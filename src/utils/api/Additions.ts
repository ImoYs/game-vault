// \src\utils\api.ts

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export const fetchGameAdditions = async (gameId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}/additions?key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch game additions");
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching game additions:", error);
    return [];
  }
};
