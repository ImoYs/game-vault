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




};


export async function fetchPopularGames() {
  try {
    // หาวันที่เริ่มต้นและสิ้นสุดของเดือนนี้ (YYYY-MM-DD)
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]; 
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    // ดึงข้อมูลเกมที่วางจำหน่ายในเดือนนี้ของปีนี้ (เรียงตามวันที่วางจำหน่ายล่าสุด)
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&ordering=-released&released=${startOfMonth},${endOfMonth}`);

    if (!res.ok) throw new Error("Failed to fetch popular games");

    const data = await res.json();
    return { 
      results: data.results, 
      month: today.getMonth(), 
      year: today.getFullYear() 
    }; // ส่งข้อมูลเดือนและปีด้วย
  } catch (error) {
    console.error(error);
    return { results: [], month: null, year: null };
  }
}

