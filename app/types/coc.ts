// Player types
export interface Player {
  tag: string;
  name: string;
  townHallLevel: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel?: number;
  versusTrophies?: number;
  bestVersusTrophies?: number;
  versusBattleWins?: number;
  role?: string;
  warPreference?: string;
  donations?: number;
  donationsReceived?: number;
  clan?: ClanBasicInfo;
  league?: League;
  legendStatistics?: LegendStatistics;
  achievements?: Achievement[];
  labels?: Label[];
  troops?: Troop[];
  heroes?: Hero[];
  spells?: Spell[];
}

export interface ClanBasicInfo {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface League {
  id: number;
  name: string;
  iconUrls: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface LegendStatistics {
  legendTrophies: number;
  bestSeason?: {
    id: string;
    rank: number;
    trophies: number;
  };
  currentSeason?: {
    rank: number;
    trophies: number;
  };
}

export interface Achievement {
  name: string;
  stars: number;
  value: number;
  target: number;
  info: string;
  completionInfo?: string;
  village: string;
}

export interface Label {
  id: number;
  name: string;
  iconUrls: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface Troop {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface Hero {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface Spell {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

// Clan types
export interface Clan {
  tag: string;
  name: string;
  type: string;
  description: string;
  location?: {
    id: number;
    name: string;
    isCountry: boolean;
    countryCode?: string;
  };
  badgeUrls: {
    small: string;
    medium: string;
    large: string;
  };
  clanLevel: number;
  clanPoints: number;
  clanVersusPoints: number;
  requiredTrophies: number;
  warFrequency: string;
  warWinStreak: number;
  warWins: number;
  warTies?: number;
  warLosses?: number;
  isWarLogPublic: boolean;
  warLeague?: {
    id: number;
    name: string;
  };
  members: number;
  memberList?: ClanMember[];
  labels?: Label[];
}

export interface ClanMember {
  tag: string;
  name: string;
  role: string;
  expLevel: number;
  league: League;
  trophies: number;
  versusTrophies: number;
  clanRank: number;
  previousClanRank: number;
  donations: number;
  donationsReceived: number;
} 