// src/utils/api.ts
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGames(page: number, pageSize: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=${pageSize}`
    );
    if (!response.ok) throw new Error("Failed to fetch games");

    const data = await response.json();
    return data.results; // ดึงแค่ `results` ออกมาใช้
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

// ฟังก์ชันดึง genres ทั้งหมดจาก API
export async function fetchGenres() {
  try {
    const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch genres");

    const data = await response.json();
    return data.results; // ดึงแค่ `results` ที่เป็นอาร์เรย์ของ genres
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

export const fetchGameDetails = async (gameId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch game details");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchGameScreenshots = async (gameId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch screenshots");
    const data = await res.json();
    return data.results; // เป็น array ของ screenshots
  } catch (error) {
    console.error(error);
    return [];
  }
};