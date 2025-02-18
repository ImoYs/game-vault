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

export async function fetchPopularGames() {
  try {
    // หาวันที่เริ่มต้นและสิ้นสุดของเดือนนี้ (YYYY-MM-DD)
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];


export async function fetchPopularGames(genre) {
  try {
    // ดึงข้อมูลเกมตาม Genre ที่ระบุ
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&genres=${genre}`);

    if (!res.ok) throw new Error("Failed to fetch popular games");

    const data = await res.json();
    return {
      results: data.results,
      month: today.getMonth(),
      year: today.getFullYear()
    }; // ส่งข้อมูลเดือนและปีด้วย
  } catch (error) {
    console.error(error);
    return { results: [], genre };
  }
}


export const fetchGameTrailers = async (gameId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}/movies?key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch game trailers");
    const data = await res.json();
    return data.results || []; // 🔹 คืนค่าเป็น array ของ trailers เหมือน fetch อื่น ๆ
  } catch (error) {
    console.error("Error fetching game trailers:", error);
    return [];
  }
};

export const fetchGameStores = async (gameId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/games/${gameId}/stores?key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch game stores");
    const data = await res.json();
    return data.results || []; // 🔹 คืนค่าเป็น array ของ stores
  } catch (error) {
    console.error("Error fetching game stores:", error);
    return [];
  }
};
