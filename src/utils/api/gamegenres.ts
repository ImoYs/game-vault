const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGamesgenre(genre) {
    try {
      // ดึงข้อมูลเกมตาม Genre ที่ระบุและจำกัดจำนวนผลลัพธ์
      const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&genres=${genre}`);
  
      if (!res.ok) throw new Error("Failed to fetch games genre");
      
      const data = await res.json();
      // Return the results based on genre and limit
      return {
        results: data.results, // แสดงผลลัพธ์ตามจำนวนที่จำกัด
        genre,
      };
    } catch (error) {
      console.error("Error fetching games genre:", error);
      return { results: [], genre };
    }
}
