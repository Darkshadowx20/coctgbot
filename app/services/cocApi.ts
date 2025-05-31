import axios from 'axios';
import config from '../config.js';
import {
  // Shared types
  Paging,
  
  // Player types
  Player,
  PlayerRankingList,
  PlayerVersusBattleRankingList,
  
  // Clan types
  Clan,
  ClanMemberList,
  ClanSearchResult,
  ClanRankingList,
  ClanVersusRankingList,
  
  // War types
  ClanWar,
  WarLog,
  ClanWarLeagueGroup,
  
  // Capital Raid types
  CapitalRaidSeasons,
  
  // League types
  LeagueList,
  LeagueSeasonList,
  LeagueRankingList,
  WarLeagueList,
  
  // Location types
  LocationList,
  LocationRankingList,
  
  // Gold Pass types
  GoldPassSeason,
  
  // Esports types
  EsportsEventList,
  
  // Labels types
  LabelList
} from '../types/coc.js';

const BASE_URL = 'https://api.clashofclans.com/v1';

// Create axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${config.COC_API_KEY}`,
    'Accept': 'application/json',
  },
});

// Helper function to encode tags
const encodeTag = (tag: string): string => {
  return encodeURIComponent(tag.startsWith('#') ? tag : `#${tag}`);
};

// Helper function to handle API errors
const handleApiError = (error: any, context: string): never => {
  if (axios.isAxiosError(error) && error.response) {
    throw new Error(`Failed to ${context}: ${error.response.data.reason || error.message}`);
  }
  throw error;
};

// ==============================
// PLAYER RELATED ENDPOINTS
// ==============================

/**
 * Get player information
 * GET /players/{playerTag}
 */
export async function getPlayer(playerTag: string): Promise<Player> {
  const encodedTag = encodeTag(playerTag);
  try {
    const response = await api.get(`/players/${encodedTag}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get player');
  }
}

/**
 * Get player rankings for a specific location
 * GET /locations/{locationId}/rankings/players
 */
export async function getPlayerRankings(
  locationId: number,
  params?: { limit?: number; after?: string; before?: string }
): Promise<PlayerRankingList> {
  try {
    const response = await api.get(`/locations/${locationId}/rankings/players`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get player rankings');
    }
}

/**
 * Get player versus battle rankings for a specific location
 * GET /locations/{locationId}/rankings/players-versus
 */
export async function getPlayerVersusBattleRankings(
  locationId: number,
  params?: { limit?: number; after?: string; before?: string }
): Promise<PlayerVersusBattleRankingList> {
  try {
    const response = await api.get(`/locations/${locationId}/rankings/players-versus`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get player versus battle rankings');
  }
}

// ==============================
// CLAN RELATED ENDPOINTS
// ==============================

/**
 * Get clan information
 * GET /clans/{clanTag}
 */
export async function getClan(clanTag: string): Promise<Clan> {
  const encodedTag = encodeTag(clanTag);
  try {
    const response = await api.get(`/clans/${encodedTag}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan');
  }
}

/**
 * List clan members
 * GET /clans/{clanTag}/members
 */
export async function getClanMembers(
  clanTag: string,
  params?: { limit?: number; after?: string; before?: string }
): Promise<ClanMemberList> {
  const encodedTag = encodeTag(clanTag);
  try {
    const response = await api.get(`/clans/${encodedTag}/members`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan members');
  }
}

/**
 * Search clans
 * GET /clans
 */
export async function searchClans(params: {
  name?: string;
  warFrequency?: string;
  locationId?: number;
  minMembers?: number;
  maxMembers?: number;
  minClanPoints?: number;
  minClanLevel?: number;
  limit?: number;
  labelIds?: string[];
  after?: string;
  before?: string;
}): Promise<ClanSearchResult> {
  try {
    const response = await api.get('/clans', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'search clans');
  }
}

/**
 * Get clan rankings for a specific location
 * GET /locations/{locationId}/rankings/clans
 */
export async function getClanRankings(
  locationId: number,
  params?: { limit?: number; after?: string; before?: string }
): Promise<ClanRankingList> {
  try {
    const response = await api.get(`/locations/${locationId}/rankings/clans`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan rankings');
  }
}

/**
 * Get clan versus rankings for a specific location
 * GET /locations/{locationId}/rankings/clans-versus
 */
export async function getClanVersusRankings(
  locationId: number,
  params?: { limit?: number; after?: string; before?: string }
): Promise<ClanVersusRankingList> {
  try {
    const response = await api.get(`/locations/${locationId}/rankings/clans-versus`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan versus rankings');
  }
}

// ==============================
// WAR RELATED ENDPOINTS
// ==============================

/**
 * Get clan's current war information
 * GET /clans/{clanTag}/currentwar
 */
export async function getCurrentWar(clanTag: string): Promise<ClanWar> {
  const encodedTag = encodeTag(clanTag);
  try {
    const response = await api.get(`/clans/${encodedTag}/currentwar`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get current war');
  }
}

/**
 * Get clan's war log
 * GET /clans/{clanTag}/warlog
 */
export async function getClanWarLog(
  clanTag: string,
  params?: { limit?: number; after?: string; before?: string }
): Promise<WarLog> {
  const encodedTag = encodeTag(clanTag);
  try {
    const response = await api.get(`/clans/${encodedTag}/warlog`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan war log');
  }
}

/**
 * Get information about clan's current clan war league group
 * GET /clans/{clanTag}/currentwar/leaguegroup
 */
export async function getCurrentWarLeagueGroup(clanTag: string): Promise<ClanWarLeagueGroup> {
  const encodedTag = encodeTag(clanTag);
  try {
    const response = await api.get(`/clans/${encodedTag}/currentwar/leaguegroup`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get current war league group');
  }
}

/**
 * Get information about individual clan war league war
 * GET /clanwarleagues/wars/{warTag}
 */
export async function getClanWarLeagueWar(warTag: string): Promise<ClanWar> {
  try {
    const response = await api.get(`/clanwarleagues/wars/${warTag}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan war league war');
  }
}

// ==============================
// CAPITAL RAID RELATED ENDPOINTS
// ==============================

/**
 * Get clan's capital raid seasons
 * GET /clans/{clanTag}/capitalraidseasons
 */
export async function getClanCapitalRaidSeasons(
  clanTag: string,
  params?: { limit?: number; after?: string; before?: string }
): Promise<CapitalRaidSeasons> {
  const encodedTag = encodeTag(clanTag);
  try {
    const response = await api.get(`/clans/${encodedTag}/capitalraidseasons`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan capital raid seasons');
  }
}

// ==============================
// LEAGUE RELATED ENDPOINTS
// ==============================

/**
 * Get list of leagues
 * GET /leagues
 */
export async function getLeagues(params?: { limit?: number; after?: string; before?: string }): Promise<LeagueList> {
  try {
    const response = await api.get('/leagues', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get leagues');
  }
}

/**
 * Get league information
 * GET /leagues/{leagueId}
 */
export async function getLeague(leagueId: number): Promise<LeagueList> {
  try {
    const response = await api.get(`/leagues/${leagueId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get league');
  }
}

/**
 * Get league seasons
 * GET /leagues/{leagueId}/seasons
 */
export async function getLeagueSeasons(
  leagueId: number,
  params?: { limit?: number; after?: string; before?: string }
): Promise<LeagueSeasonList> {
  try {
    const response = await api.get(`/leagues/${leagueId}/seasons`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get league seasons');
  }
}

/**
 * Get league season rankings
 * GET /leagues/{leagueId}/seasons/{seasonId}
 */
export async function getLeagueSeasonRankings(
  leagueId: number,
  seasonId: string,
  params?: { limit?: number; after?: string; before?: string }
): Promise<LeagueRankingList> {
  try {
    const response = await api.get(`/leagues/${leagueId}/seasons/${seasonId}`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get league season rankings');
  }
}

/**
 * Get war leagues
 * GET /warleagues
 */
export async function getWarLeagues(params?: { limit?: number; after?: string; before?: string }): Promise<WarLeagueList> {
  try {
    const response = await api.get('/warleagues', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get war leagues');
  }
}

/**
 * Get war league information
 * GET /warleagues/{leagueId}
 */
export async function getWarLeague(leagueId: number): Promise<WarLeagueList> {
  try {
    const response = await api.get(`/warleagues/${leagueId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get war league');
  }
}

// ==============================
// LOCATION RELATED ENDPOINTS
// ==============================

/**
 * Get list of locations
 * GET /locations
 */
export async function getLocations(params?: { limit?: number; after?: string; before?: string }): Promise<LocationList> {
  try {
    const response = await api.get('/locations', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get locations');
  }
}

/**
 * Get location information
 * GET /locations/{locationId}
 */
export async function getLocation(locationId: number): Promise<LocationList> {
  try {
    const response = await api.get(`/locations/${locationId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get location');
  }
}

// ==============================
// GOLDPASS RELATED ENDPOINTS
// ==============================

/**
 * Get current gold pass season information
 * GET /goldpass/seasons/current
 */
export async function getCurrentGoldPassSeason(): Promise<GoldPassSeason> {
  try {
    const response = await api.get('/goldpass/seasons/current');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get current gold pass season');
  }
}

// ==============================
// ESPORTS RELATED ENDPOINTS
// ==============================

/**
 * Get esports events
 * GET /esports/events
 */
export async function getEsportsEvents(): Promise<EsportsEventList> {
  try {
    const response = await api.get('/esports/events');
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get esports events');
  }
}

// ==============================
// LABELS RELATED ENDPOINTS
// ==============================

/**
 * Get player labels
 * GET /labels/players
 */
export async function getPlayerLabels(params?: { limit?: number; after?: string; before?: string }): Promise<LabelList> {
  try {
    const response = await api.get('/labels/players', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get player labels');
  }
}

/**
 * Get clan labels
 * GET /labels/clans
 */
export async function getClanLabels(params?: { limit?: number; after?: string; before?: string }): Promise<LabelList> {
  try {
    const response = await api.get('/labels/clans', { params });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'get clan labels');
  }
}

export default {
  // Player endpoints
  getPlayer,
  getPlayerRankings,
  getPlayerVersusBattleRankings,
  
  // Clan endpoints
  getClan,
  getClanMembers,
  searchClans,
  getClanRankings,
  getClanVersusRankings,
  
  // War endpoints
  getCurrentWar,
  getClanWarLog,
  getCurrentWarLeagueGroup,
  getClanWarLeagueWar,
  
  // Capital Raid endpoints
  getClanCapitalRaidSeasons,
  
  // League endpoints
  getLeagues,
  getLeague,
  getLeagueSeasons,
  getLeagueSeasonRankings,
  getWarLeagues,
  getWarLeague,
  
  // Location endpoints
  getLocations,
  getLocation,
  
  // Gold Pass endpoints
  getCurrentGoldPassSeason,
  
  // Esports endpoints
  getEsportsEvents,
  
  // Labels endpoints
  getPlayerLabels,
  getClanLabels,
}; 