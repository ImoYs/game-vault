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

export const fetchGameTrailers = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/games/${id}/movies?key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch game trailers: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // ตรวจสอบว่า API มี key `results` หรือไม่
    if (!data?.results) {
      console.warn("No trailers found for this game.");
      return []; // ถ้าไม่มี results ให้ return empty array
    }

    return data?.results ?? [];
  } catch (error) {
    console.error("Error fetching game trailers:", error);
    return [];
  }
};




export async function fetchPopularGames() {
  try {
    // Get the current year
    const today = new Date();
    const currentYear = today.getFullYear();

    // ดึงข้อมูลเกมทั้งหมด
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}`);

    if (!res.ok) throw new Error("Failed to fetch popular games");

    const data = await res.json();

    // Filter games by current year, 'recommended' rating, and reviews_count > 1000
    const recommendedGames = data.results.filter(game => {
      const releaseDate = new Date(game.released);
      const releaseYear = releaseDate.getFullYear();

      return (
        game.ratings.some(rating => rating.title === 'recommended') && 
        game.reviews_count > 1000 &&
        releaseYear === currentYear // Check if the release year is the current year
      );
    });

    // Return only the recommended games released in the current year
    return { 
      results: recommendedGames,
      year: currentYear
    };
  } catch (error) {
    console.error(error);
    return { results: [], year: null };
  }
}

export const fetchRandomGames = async (count = 5) => {
  try {
    const games = [];
    for (let i = 0; i < count; i++) {
      const randomId = Math.floor(Math.random() * 1000); // Adjust range as needed
      console.log(`Fetching Game ID: ${randomId}`);
      
      const response = await fetch(`${BASE_URL}/games/${randomId}?key=${API_KEY}`);
      if (!response.ok) continue; // Skip if fetch fails
      
      const data = await response.json();
      if (data) games.push(data);
    }
    return games;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};
