import { Player } from '../types/coc.js';
import { InlineKeyboard } from 'grammy';

/**
 * Escape special Markdown characters
 */
function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
}

/**
 * Format player data for display in Telegram
 */
export function formatPlayerInfo(player: Player): string {
  const clanInfo = player.clan 
    ? `\n🛡 Clan: ${escapeMarkdown(player.clan.name)} (Level ${player.clan.clanLevel})` 
    : '\n🛡 Clan: None';
  
  const leagueInfo = player.league 
    ? `\n🏆 League: ${escapeMarkdown(player.league.name)}` 
    : '\n🏆 League: None';

  return `
*${escapeMarkdown(player.name)}* (${player.tag})
👑 TH Level: ${player.townHallLevel}
⭐ Experience: Level ${player.expLevel}
${leagueInfo}
🏆 Trophies: ${player.trophies} (Best: ${player.bestTrophies})
${clanInfo}
⚔️ War Stars: ${player.warStars}
🗡 Attack Wins: ${player.attackWins}
🛡 Defense Wins: ${player.defenseWins}
🎁 Donations: ${player.donations || 0}
📦 Donations Received: ${player.donationsReceived || 0}
`.trim();
}

/**
 * Format hero information from player data
 */
export function formatHeroes(player: Player): string {
  if (!player.heroes || player.heroes.length === 0) {
    return 'No heroes unlocked';
  }

  return player.heroes
    .filter(hero => hero.village === 'home')
    .map(hero => `${escapeMarkdown(hero.name)}: Level ${hero.level}/${hero.maxLevel}`)
    .join('\n');
}

/**
 * Format troops information from player data
 */
export function formatTroops(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No troops data available';
  }

  // Get home village troops and sort by level (highest first)
  const homeTroops = player.troops
    .filter(troop => troop.village === 'home')
    .sort((a, b) => {
      // Sort by percentage of max level first
      const aPercent = a.level / a.maxLevel;
      const bPercent = b.level / b.maxLevel;
      
      return bPercent - aPercent;
    });

  // Get top 10 troops
  const topTroops = homeTroops.slice(0, 10);
  
  return topTroops
    .map(troop => `${escapeMarkdown(troop.name)}: Level ${troop.level}/${troop.maxLevel}`)
    .join('\n');
}

/**
 * Create inline keyboard for player details
 */
export function createPlayerKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("Heroes", `heroes_${playerTag}`)
    .text("Troops", `troops_${playerTag}`)
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
 * Format spells information from player data
 */
export function formatSpells(player: Player): string {
  if (!player.spells || player.spells.length === 0) {
    return 'No spells data available';
  }

  return player.spells
    .filter(spell => spell.village === 'home')
    .map(spell => `${escapeMarkdown(spell.name)}: Level ${spell.level}/${spell.maxLevel}`)
    .join('\n');
}

/**
 * Format achievements information from player data
 */
export function formatAchievements(player: Player): string {
  if (!player.achievements || player.achievements.length === 0) {
    return 'No achievements data available';
  }

  // Get top 10 achievements sorted by stars
  const topAchievements = [...player.achievements]
    .filter(achievement => achievement.village === 'home')
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 10);
  
  return topAchievements
    .map(achievement => `${escapeMarkdown(achievement.name)}: ⭐ ${achievement.stars} (${achievement.value}/${achievement.target})`)
    .join('\n');
}

export default {
  formatPlayerInfo,
  formatHeroes,
  formatTroops,
  formatSpells,
  formatAchievements,
  createPlayerKeyboard,
  createBackToPlayerKeyboard,
}; 