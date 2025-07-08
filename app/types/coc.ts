// Shared types
export interface BadgeUrls {
  small: string;
  medium: string;
  large: string;
}

export interface IconUrls {
  small: string;
  medium: string;
  large: string;
}

export interface Label {
  id: number;
  name: string;
  iconUrls: IconUrls;
}

export interface Location {
  id: number;
  name: string;
  isCountry: boolean;
  countryCode?: string;
}

export interface League {
  id: number;
  name: string;
  iconUrls: IconUrls;
}

export interface BuilderBaseLeague {
  id: number;
  name: string | { [key: string]: string };
}

export interface Paging {
  cursors?: {
    after?: string;
    before?: string;
  };
}

// ==============================
// PLAYER RELATED TYPES
// ==============================
export interface Player {
  tag: string;
  name: string;
  townHallLevel: number;
  townHallWeaponLevel?: number;
  expLevel: number;
  trophies: number;
  bestTrophies: number;
  warStars: number;
  attackWins: number;
  defenseWins: number;
  builderHallLevel?: number;
  builderBaseTrophies?: number;
  bestBuilderBaseTrophies?: number;
  versusTrophies?: number; // Legacy field
  bestVersusTrophies?: number; // Legacy field
  versusBattleWins?: number;
  role?: string;
  warPreference?: string;
  donations?: number;
  donationsReceived?: number;
  clan?: ClanBasicInfo;
  league?: League;
  builderBaseLeague?: BuilderBaseLeague;
  legendStatistics?: LegendStatistics;
  achievements?: Achievement[];
  labels?: Label[];
  troops?: Troop[];
  heroes?: Hero[];
  spells?: Spell[];
  heroEquipment?: HeroEquipment[];
  clanCapitalContributions?: number;
}

export interface ClanBasicInfo {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: BadgeUrls;
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

export interface HeroEquipment {
  name: string;
  level: number;
  maxLevel: number;
  village: string;
}

export interface PlayerRanking {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  attackWins: number;
  defenseWins: number;
  rank: number;
  clan?: ClanBasicInfo;
  league?: League;
}

export interface PlayerRankingList {
  items: PlayerRanking[];
  paging?: Paging;
}

export interface PlayerVersusBattleRanking {
  tag: string;
  name: string;
  expLevel: number;
  versusTrophies: number;
  versusBattleWins: number;
  rank: number;
  clan?: ClanBasicInfo;
}

export interface PlayerVersusBattleRankingList {
  items: PlayerVersusBattleRanking[];
  paging?: Paging;
}

// ==============================
// CLAN RELATED TYPES
// ==============================
export interface Clan {
  tag: string;
  name: string;
  type: string;
  description: string;
  location?: Location;
  badgeUrls: BadgeUrls;
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
  clanCapital?: ClanCapital;
}

export interface ClanCapital {
  capitalHallLevel: number;
  districts?: {
    id: number;
    name: string;
    districtHallLevel: number;
  }[];
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

export interface ClanMemberList {
  items: ClanMember[];
  paging?: Paging;
}

export interface ClanSearchResult {
  items: Clan[];
  paging?: Paging;
}

export interface ClanRanking {
  tag: string;
  name: string;
  location: Location;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  members: number;
  clanPoints: number;
  rank: number;
  previousRank?: number;
}

export interface ClanRankingList {
  items: ClanRanking[];
  paging?: Paging;
}

export interface ClanVersusRanking {
  tag: string;
  name: string;
  location: Location;
  badgeUrls: BadgeUrls;
  clanLevel: number;
  members: number;
  clanVersusPoints: number;
  rank: number;
  previousRank?: number;
}

export interface ClanVersusRankingList {
  items: ClanVersusRanking[];
  paging?: Paging;
}

// ==============================
// WAR RELATED TYPES
// ==============================
export interface ClanWar {
  clan: WarClan;
  opponent: WarClan;
  startTime: string;
  endTime: string;
  state: 'preparation' | 'inWar' | 'warEnded' | 'notInWar';
  teamSize: number;
  preparationStartTime?: string;
  warStartTime?: string;
  result?: 'win' | 'lose' | 'tie';
}

export interface WarClan {
  tag: string;
  name: string;
  clanLevel: number;
  attacks?: number;
  stars?: number;
  destructionPercentage?: number;
  badgeUrls: BadgeUrls;
  members?: WarMember[];
}

export interface WarMember {
  tag: string;
  name: string;
  townhallLevel: number;
  mapPosition: number;
  attacks?: WarAttack[];
  opponentAttacks?: number;
  bestOpponentAttack?: WarAttack;
}

export interface WarAttack {
  attackerTag: string;
  defenderTag: string;
  stars: number;
  destructionPercentage: number;
  order: number;
  duration: number;
}

export interface WarLog {
  items: WarLogEntry[];
  paging?: Paging;
}

export interface WarLogEntry {
  result: 'win' | 'lose' | 'tie';
  endTime: string;
  teamSize: number;
  clan: {
    tag: string;
    name: string;
    clanLevel: number;
    attacks: number;
    stars: number;
    destructionPercentage: number;
    badgeUrls: BadgeUrls;
  };
  opponent: {
    tag: string;
    name: string;
    clanLevel: number;
    stars: number;
    destructionPercentage: number;
    badgeUrls: BadgeUrls;
  };
}

// ==============================
// CLAN WAR LEAGUE TYPES
// ==============================
export interface ClanWarLeagueGroup {
  tag: string;
  state: 'preparation' | 'inWar' | 'ended';
  season: string;
  clans: ClanWarLeagueClan[];
  rounds: ClanWarLeagueRound[];
}

export interface ClanWarLeagueClan {
  tag: string;
  name: string;
  clanLevel: number;
  badgeUrls: BadgeUrls;
  members: ClanWarLeagueMember[];
}

export interface ClanWarLeagueMember {
  tag: string;
  name: string;
  townHallLevel: number;
}

export interface ClanWarLeagueRound {
  warTags: string[];
}

// ==============================
// CAPITAL RAID SEASONS TYPES
// ==============================
export interface CapitalRaidSeasons {
  items: CapitalRaidSeason[];
  paging?: Paging;
}

export interface CapitalRaidSeason {
  id: string;
  startTime: string;
  endTime: string;
  capitalTotalLoot: number;
  raidsCompleted: number;
  totalAttacks: number;
  enemyDistrictsDestroyed: number;
  offensiveReward: number;
  defensiveReward: number;
  members?: CapitalRaidMember[];
  attackLog?: CapitalRaidAttackLog[];
  defenseLog?: CapitalRaidDefenseLog[];
}

export interface CapitalRaidMember {
  tag: string;
  name: string;
  attacks: number;
  attackLimit: number;
  bonusAttackLimit: number;
  capitalResourcesLooted: number;
}

export interface CapitalRaidAttackLog {
  defender: {
    tag: string;
    name: string;
    level: number;
    badgeUrls: BadgeUrls;
  };
  attackCount: number;
  districtCount: number;
  districtsDestroyed: number;
  districts: CapitalRaidDistrict[];
}

export interface CapitalRaidDefenseLog {
  attacker: {
    tag: string;
    name: string;
    level: number;
    badgeUrls: BadgeUrls;
  };
  attackCount: number;
  districtCount: number;
  districtsDestroyed: number;
  districts: CapitalRaidDistrict[];
}

export interface CapitalRaidDistrict {
  id: number;
  name: string;
  districtHallLevel: number;
  destructionPercent: number;
  attackCount: number;
  stars: number;
  bestAttack: {
    attacker: {
      tag: string;
      name: string;
    };
    destructionPercent: number;
    stars: number;
  };
}

// ==============================
// LEAGUE RELATED TYPES
// ==============================
export interface LeagueList {
  items: League[];
}

export interface LeagueSeason {
  id: string;
}

export interface LeagueSeasonList {
  items: LeagueSeason[];
  paging?: Paging;
}

export interface LeagueRanking {
  tag: string;
  name: string;
  expLevel: number;
  trophies: number;
  attackWins: number;
  defenseWins: number;
  rank: number;
  clan?: ClanBasicInfo;
  previousRank?: number;
}

export interface LeagueRankingList {
  items: LeagueRanking[];
  paging?: Paging;
}

export interface WarLeague {
  id: number;
  name: string;
}

export interface WarLeagueList {
  items: WarLeague[];
}

// ==============================
// LOCATION RELATED TYPES
// ==============================
export interface LocationList {
  items: Location[];
  paging?: Paging;
}

export interface LocationRankingList {
  items: PlayerRanking[] | ClanRanking[];
  paging?: Paging;
}

// ==============================
// GOLDPASS RELATED TYPES
// ==============================
export interface GoldPassSeason {
  startTime: string;
  endTime: string;
}

// ==============================
// ESPORTS RELATED TYPES
// ==============================
export interface EsportsEvent {
  name: string;
  startTime: string;
  endTime: string;
  status: string;
  type: string;
  teams: EsportsTeam[];
}

export interface EsportsTeam {
  tag: string;
  name: string;
  badgeUrls: BadgeUrls;
}

export interface EsportsEventList {
  items: EsportsEvent[];
}

// ==============================
// LABELS RELATED TYPES
// ==============================
export interface LabelList {
  items: Label[];
  paging?: Paging;
} 