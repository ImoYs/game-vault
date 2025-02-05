import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}/games?key=${API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch games");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching games" }, { status: 500 });
  }
}
