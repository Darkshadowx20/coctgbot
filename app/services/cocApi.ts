import axios from 'axios';
import config from '../config.js';

const BASE_URL = 'https://api.clashofclans.com/v1';

// Create axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${config.cocApiKey}`,
    'Accept': 'application/json',
  },
});

export async function getPlayer(playerTag: string) {
  // Player tags need to be URL encoded with # replaced by %23
  const encodedTag = encodeURIComponent(playerTag.startsWith('#') ? playerTag : `#${playerTag}`);
  try {
    const response = await api.get(`/players/${encodedTag}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Failed to get player: ${error.response.data.reason || error.message}`);
    }
    throw error;
  }
}

export async function getClan(clanTag: string) {
  // Clan tags need to be URL encoded with # replaced by %23
  const encodedTag = encodeURIComponent(clanTag.startsWith('#') ? clanTag : `#${clanTag}`);
  try {
    const response = await api.get(`/clans/${encodedTag}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`Failed to get clan: ${error.response.data.reason || error.message}`);
    }
    throw error;
  }
}

export default {
  getPlayer,
  getClan,
}; 