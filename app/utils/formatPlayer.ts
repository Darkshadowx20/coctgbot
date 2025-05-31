import { Player } from '../types/coc.js';

/**
 * Format player data for display in Telegram
 */
export function formatPlayerInfo(player: Player): string {
  const clanInfo = player.clan 
    ? `\n🛡 Clan: ${player.clan.name} (Level ${player.clan.clanLevel})` 
    : '\n🛡 Clan: None';
  
  const leagueInfo = player.league 
    ? `\n🏆 League: ${player.league.name}` 
    : '\n🏆 League: None';

  return `
*${player.name}* (${player.tag})
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
    .map(hero => `${hero.name}: Level ${hero.level}/${hero.maxLevel}`)
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
    .map(troop => `${troop.name}: Level ${troop.level}/${troop.maxLevel}`)
    .join('\n');
}

export default {
  formatPlayerInfo,
  formatHeroes,
  formatTroops,
}; 