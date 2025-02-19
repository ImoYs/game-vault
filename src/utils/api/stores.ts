const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export interface StoreLink {
    id: number;
    game_id: string;
    store_id: number; // ✅ แก้เป็น number
    url: string;
}

// ✅ ต้อง export storeMapping ออกไป
export const storeMapping: Record<number, { name: string; logo: string }> = {
    1: { name: "Steam", logo: "/Steam_logo.png" },
    2: { name: "Microsoft", logo: "/microsoft.png" },
    3: { name: "playstation", logo: "/PS.png" },
    4: { name: "Apple Store", logo: "/Apple_Store.png" },
    5: { name: "GOG", logo: "/gog.png" },
    6: { name: "Nintendo", logo: "/nintendo.png" },
    7: { name: "Xbox", logo: "/xbox.png" },
    8: { name: "Google Play", logo: "/Google_Play.png" },
    9: { name: "itch.io", logo: "/itch.png" },
    10: { name: "10", logo: "/" },
    11: { name: "Epic", logo: "/Epic.png" },

};

export async function fetchGameStores(gameId: string): Promise<StoreLink[]> {
    try {
        const res = await fetch(`${BASE_URL}/games/${gameId}/stores?key=${API_KEY}`);
        if (!res.ok) throw new Error("Failed to fetch game stores");

        const data = await res.json();

        // ✅ แปลง store_id เป็น number
        return data.results?.map((store: StoreLink) => ({
            ...store,
            store_id: Number(store.store_id),
        })) || [];
    } catch (error) {
        console.error("Error fetching game stores:", error);
        return [];
    }
}
