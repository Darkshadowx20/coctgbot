import { 
  Player, 
  PlayerRankingList, 
  PlayerVersusBattleRankingList,
  LeagueRankingList
} from '../types/coc.js';
import { InlineKeyboard } from 'grammy';
import { escapeMarkdown } from './formatClan.js';

/**
 * Format player data for display in Telegram
 */
export function formatPlayerInfo(player: Player): string {
  const clanInfo = player.clan 
    ? `\n🛡️ Clan: ${escapeMarkdown(player.clan.name)} \\(${escapeMarkdown(player.clan.tag)}\\)`
    : '\n🛡️ Clan: None';
  
  const leagueInfo = player.league 
    ? `\n🏆 League: ${escapeMarkdown(player.league.name)}` 
    : '\n🏆 League: None';

  const builderBaseInfo = player.builderHallLevel 
    ? `\n\n*Builder Base*\n🏠 Builder Hall: ${player.builderHallLevel}\n🏆 Versus Trophies: ${player.versusTrophies}\n🏅 Best Versus Trophies: ${player.bestVersusTrophies}\n⚔️ Versus Battle Wins: ${player.versusBattleWins}`
    : '';

  return `
*${escapeMarkdown(player.name)}* \\(${escapeMarkdown(player.tag)}\\)
${clanInfo}
${leagueInfo}
👑 Experience Level: ${player.expLevel}
🏠 Town Hall: ${player.townHallLevel}
🏆 Trophies: ${player.trophies}
🏅 Best Trophies: ${player.bestTrophies}
⭐ War Stars: ${player.warStars}
⚔️ Attack Wins: ${player.attackWins}
🛡️ Defense Wins: ${player.defenseWins}
${player.role ? `\n👤 Role: ${escapeMarkdown(player.role)}` : ''}
${player.donations !== undefined ? `\n📦 Donations: ${player.donations}` : ''}
${player.donationsReceived !== undefined ? `\n📥 Donations Received: ${player.donationsReceived}` : ''}
${builderBaseInfo}
`.trim();
}

/**
 * Create inline keyboard for player details
 */
export function createPlayerKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("Troops", `troops_${playerTag}`)
    .text("Heroes", `heroes_${playerTag}`)
    .row()
    .text("Spells", `spells_${playerTag}`)
    .text("Achievements", `achievements_${playerTag}`);
}

/**
 * Create a back button for details views
 */
export function createBackToPlayerKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("« Back to Player Info", `back_to_player_${playerTag}`);
}

/**
 * Format player troops for display in Telegram
 */
export function formatPlayerTroops(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No troop data available';
  }

  // Filter home village troops and exclude super troops
  const homeVillageTroops = player.troops.filter(troop => 
    troop.village === 'home' && !troop.name.startsWith('Super')
  );
  
  // Sort troops by name
  const sortedTroops = [...homeVillageTroops].sort((a, b) => a.name.localeCompare(b.name));
  
  const troopsList = sortedTroops.map(troop => {
    const maxLevelIndicator = troop.level === troop.maxLevel ? ' ✅' : '';
    return `${escapeMarkdown(troop.name)}: ${troop.level}/${troop.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Troops for ${escapeMarkdown(player.name)}*

${troopsList}
`.trim();
}

/**
 * Format player heroes for display in Telegram
 */
export function formatPlayerHeroes(player: Player): string {
  if (!player.heroes || player.heroes.length === 0) {
    return 'No hero data available';
  }

  // Filter home village heroes
  const homeVillageHeroes = player.heroes.filter(hero => hero.village === 'home');
  
  // Sort heroes by name
  const sortedHeroes = [...homeVillageHeroes].sort((a, b) => a.name.localeCompare(b.name));
  
  const heroesList = sortedHeroes.map(hero => {
    const maxLevelIndicator = hero.level === hero.maxLevel ? ' ✅' : '';
    return `${escapeMarkdown(hero.name)}: ${hero.level}/${hero.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Heroes for ${escapeMarkdown(player.name)}*

${heroesList}
`.trim();
}

/**
 * Format player spells for display in Telegram
 */
export function formatPlayerSpells(player: Player): string {
  if (!player.spells || player.spells.length === 0) {
    return 'No spell data available';
  }

  // Filter home village spells
  const homeVillageSpells = player.spells.filter(spell => spell.village === 'home');
  
  // Sort spells by name
  const sortedSpells = [...homeVillageSpells].sort((a, b) => a.name.localeCompare(b.name));
  
  const spellsList = sortedSpells.map(spell => {
    const maxLevelIndicator = spell.level === spell.maxLevel ? ' ✅' : '';
    return `${escapeMarkdown(spell.name)}: ${spell.level}/${spell.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Spells for ${escapeMarkdown(player.name)}*

${spellsList}
`.trim();
}

/**
 * Format player achievements
 */
export function formatPlayerAchievements(player: Player): string {
  if (!player.achievements || player.achievements.length === 0) {
    return 'No achievements data available';
  }

  // Sort achievements by completion percentage (highest first)
  const sortedAchievements = [...player.achievements].sort((a, b) => {
    const aPercent = (a.value / a.target) * 100;
    const bPercent = (b.value / b.target) * 100;
    return bPercent - aPercent;
  });

  // Get top 5 in-progress achievements
  const inProgress = sortedAchievements
    .filter(a => a.value < a.target)
    .slice(0,15);

  // Count completed achievements
  const completed = player.achievements.filter(a => a.value >= a.target).length;
  const total = player.achievements.length;

  const achievementsList = inProgress.map(achievement => {
    const percent = Math.floor((achievement.value / achievement.target) * 100);
    const stars = '⭐'.repeat(Math.floor(percent / 33.33)) + '☆'.repeat(3 - Math.floor(percent / 33.33));
    return `${stars} ${escapeMarkdown(achievement.name)}: ${achievement.value}/${achievement.target} \\(${percent}%\\)`;
  }).join('\n');

  return `
*Achievements for ${escapeMarkdown(player.name)}*

*Top In\\-Progress Achievements:*
${achievementsList}

*Completed: ${completed}/${total}*
`.trim();
}

/**
 * Format player rankings
 */
export function formatPlayerRankings(rankings: PlayerRankingList): string {
  if (!rankings.items || rankings.items.length === 0) {
    return 'No player ranking data available';
  }
  
  const rankingsList = rankings.items.slice(0, 10).map(player => {
    const clanInfo = player.clan ? ` | ${escapeMarkdown(player.clan.name)}` : '';
    return `${player.rank}\\. ${escapeMarkdown(player.name)} \\- ${player.trophies} 🏆${clanInfo}`;
  }).join('\n');
  
  return `
*Top Ranked Players*

${rankingsList}
${rankings.items.length > 10 ? `\n_...and ${rankings.items.length - 10} more players_` : ''}
`.trim();
}

/**
 * Format player versus battle rankings
 */
export function formatPlayerVersusBattleRankings(rankings: PlayerVersusBattleRankingList): string {
  if (!rankings.items || rankings.items.length === 0) {
    return 'No player versus battle ranking data available';
  }
  
  const rankingsList = rankings.items.slice(0, 10).map(player => {
    const clanInfo = player.clan ? ` | ${escapeMarkdown(player.clan.name)}` : '';
    return `${player.rank}\\. ${escapeMarkdown(player.name)} \\- ${player.versusTrophies} 🏆${clanInfo}`;
  }).join('\n');
  
  return `
*Top Ranked Players \\(Builder Base\\)*

${rankingsList}
${rankings.items.length > 10 ? `\n_...and ${rankings.items.length - 10} more players_` : ''}
`.trim();
}

/**
 * Format league season rankings
 */
export function formatLeagueSeasonRankings(rankings: LeagueRankingList, leagueName: string, seasonId: string): string {
  if (!rankings.items || rankings.items.length === 0) {
    return 'No league season ranking data available';
  }
  
  const rankingsList = rankings.items.slice(0, 10).map(player => {
    const clanInfo = player.clan ? ` | ${escapeMarkdown(player.clan.name)}` : '';
    return `${player.rank}\\. ${escapeMarkdown(player.name)} \\- ${player.trophies} 🏆${clanInfo}`;
  }).join('\n');
  
  return `
*${escapeMarkdown(leagueName)} \\- Season ${seasonId}*

${rankingsList}
${rankings.items.length > 10 ? `\n_...and ${rankings.items.length - 10} more players_` : ''}
`.trim();
}

export default {
  formatPlayerInfo,
  formatPlayerTroops,
  formatPlayerHeroes,
  formatPlayerSpells,
  formatPlayerAchievements,
  formatPlayerRankings,
  formatPlayerVersusBattleRankings,
  formatLeagueSeasonRankings,
  createPlayerKeyboard,
  createBackToPlayerKeyboard,
}; 