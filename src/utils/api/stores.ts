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
    2: { name: "Microsoft", logo: "/" },
    3: { name: "playstation", logo: "/" },
    4: { name: "Apple Store", logo: "/" },
    5: { name: "GOG", logo: "/" },
    6: { name: "Nintendo", logo: "/" },
    7: { name: "Xbox", logo: "/" },
    8: { name: "Google Play", logo: "/" },
    9: { name: "9", logo: "/" },
    10: { name: "10", logo: "/" },
    11: { name: "Epic", logo: "/" },
    12: { name: "12", logo: "/" },
    13: { name: "13", logo: "/" },
    14: { name: "14", logo: "/" },
    15: { name: "15", logo: "/" },
    16: { name: "16", logo: "/" },
    17: { name: "17", logo: "/" },
    18: { name: "18", logo: "/" },
    19: { name: "19", logo: "/" },
    20: { name: "20", logo: "/" },
    21: { name: "21", logo: "/" },

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
