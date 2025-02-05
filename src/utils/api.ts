// src/utils/api.ts
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";
console.log(API_KEY);

export async function fetchGames() {
  try {
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch games");

    const data = await response.json();
    return data.results; // ดึงแค่ `results` ออกมาใช้
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}
