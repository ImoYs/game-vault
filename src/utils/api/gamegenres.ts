const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGamesgenre(genre, page = 1, pageSize = 20) {
  try {
    // ดึงข้อมูลเกมตาม Genre ที่ระบุ
    const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&genres=${genre}&page=${page}&page_size=${pageSize}`);
    
    if (!res.ok) throw new Error("Failed to fetch games genre");
    
    const data = await res.json();
    const games = data.results;

    // ดึง screenshots ของแต่ละเกม
    const gamesWithScreenshots = await Promise.all(
      games.map(async (game) => {
        try {
          const screenshotsRes = await fetch(`${BASE_URL}/games/${game.id}/screenshots?key=${API_KEY}`);
          if (!screenshotsRes.ok) throw new Error("Failed to fetch screenshots");

          const screenshotsData = await screenshotsRes.json();
          return { ...game, screenshots: screenshotsData.results }; // เพิ่ม screenshots ลงใน object เกม
        } catch (error) {
          console.error(`Error fetching screenshots for game ${game.id}:`, error);
          return { ...game, screenshots: [] }; // ถ้าดึงไม่ได้ ให้ screenshots เป็น []
        }
      })
    );

    return {
      results: gamesWithScreenshots,
      hasMore: games.length === pageSize,
    };
  } catch (error) {
    console.error("Error fetching games genre:", error);
    return { results: [], hasMore: false };
  }
}
