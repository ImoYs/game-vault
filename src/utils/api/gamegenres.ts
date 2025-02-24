const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGamesgenre(genre, page = 1, pageSize = 20) {
  try {
    // ดึงข้อมูลเกมตาม Genre ที่ระบุและจำกัดจำนวนผลลัพธ์
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=${pageSize}`);
    
    if (!res.ok) throw new Error("Failed to fetch games genre");
    
    const data = await res.json();
    
    return {
      results: data.results, // เกมที่ดึงมาได้
      hasMore: data.results.length === pageSize, // ถ้าจำนวนผลลัพธ์น้อยกว่า pageSize แสดงว่าไม่มีหน้าเพิ่มเติม
    };
  } catch (error) {
    console.error("Error fetching games genre:", error);
    return { results: [], hasMore: false };
  }
}
