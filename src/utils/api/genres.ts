const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchGenres() {
  try {
    const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch genres");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
// const BASE_URL = "https://api.rawg.io/api";

// export async function fetchGenres() {
//   try {
//     const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);
//     if (!response.ok) throw new Error("Failed to fetch genres");
//     const data = await response.json();

//     // For each genre, fetch its screenshots (or related games' screenshots)
//     const genresWithScreenshots = await Promise.all(
//       data.results.map(async (genre) => {
//         const genreId = genre.id;
//         // Fetch related games (you can adjust the count or parameters as needed)
//         const genreGamesResponse = await fetch(`${BASE_URL}/games?genres=${genreId}&key=${API_KEY}`);
//         const genreGamesData = await genreGamesResponse.json();
        
//         // Extract screenshots for the first game or adjust as needed
//         let screenshots = [];
//         if (genreGamesData.results.length > 0) {
//           const firstGameId = genreGamesData.results[0].id;
//           const screenshotsResponse = await fetch(`${BASE_URL}/games/${firstGameId}/screenshots?key=${API_KEY}`);
//           const screenshotsData = await screenshotsResponse.json();
//           screenshots = screenshotsData.results || [];
//         }

//         return {
//           ...genre,
//           screenshots: screenshots, // Add the screenshots for the genre (or related game)
//         };
//       })
//     );

//     return genresWithScreenshots;
//   } catch (error) {
//     console.error("Error fetching genres:", error);
//     return [];
//   }
// }

