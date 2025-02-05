// src/utils/api.ts
import axios from 'axios';

const API_KEY = process.env.RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export const getGames = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        key: API_KEY,
        page_size: 10,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};