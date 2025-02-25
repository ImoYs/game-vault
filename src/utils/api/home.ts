// ไปแก้ขื่อ file เอานะ
const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export const fetchRandomGames = async (count = 6) => {
  try {
    const games = [];
    for (let i = 0; i < count; i++) {
      const randomId = Math.floor(Math.random() * 1000); // ปรับช่วง ID ตามต้องการ
      console.log(`Fetching Game ID: ${randomId}`);

      const response = await fetch(`${BASE_URL}/games/${randomId}?key=${API_KEY}`);
      if (!response.ok) continue; // ข้ามถ้าดึงข้อมูลไม่สำเร็จ

      const data = await response.json();
      if (!data) continue;

      // ดึงข้อมูล screenshots
      const screenshotsResponse = await fetch(`${BASE_URL}/games/${randomId}/screenshots?key=${API_KEY}`);
      const screenshotsData = await screenshotsResponse.json();

      // เพิ่ม screenshots ลงไปในข้อมูลเกม
      games.push({
        ...data,
        screenshots: screenshotsData.results || [], // ตรวจสอบว่ามี screenshots หรือไม่
      });
    }
    return games;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}


export async function fetchPopularGames(genre) {
  try {
    // ดึงข้อมูลเกมตาม Genre ที่ระบุ
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&genres=${genre}`);

    if (!res.ok) throw new Error("Failed to fetch popular games");

    const data = await res.json();
    //console.log(`API response for ${genre}:`, data);
    // Return the results based on genre without any further filtering
    return {
      results: data.results,
      genre,
    };
  } catch (error) {
    console.error(error);
    return { results: [], genre };
  }
}