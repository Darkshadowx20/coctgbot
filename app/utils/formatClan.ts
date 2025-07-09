import { 
  Clan, 
  ClanMember, 
  ClanMemberList,
  WarLog, 
  ClanWar, 
  CapitalRaidSeason, 
  ClanSearchResult,
  ClanWarLeagueGroup,
  ClanRankingList,
  ClanVersusRankingList
} from '../types/coc.js';
import { InlineKeyboard } from 'grammy';

/**
 * Escape special Markdown characters
 */
export function escapeMarkdown(text: string): string {
  if (!text) return '';
  // Make sure to explicitly escape all special characters including pipe and period
  return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
}

/**
 * Format clan data for display in Telegram
 */
export function formatClanInfo(clan: Clan): string {
  // Handle war statistics
  const warWins = clan.warWins !== undefined ? clan.warWins : 0;
  const warTies = clan.warTies !== undefined ? clan.warTies : 0;
  const warLosses = clan.warLosses !== undefined ? clan.warLosses : 0;
  
  // Handle league info
  const warLeagueInfo = clan.warLeague 
    ? `${escapeMarkdown(clan.warLeague.name)}` 
    : 'None';
  
  // Handle location
  const locationInfo = clan.location 
    ? `${escapeMarkdown(clan.location.name)}` 
    : 'Not set';
  
  // Format clan versus points (show 0 instead of N/A)
  const clanVersusPoints = clan.clanVersusPoints !== undefined 
    ? clan.clanVersusPoints.toLocaleString() 
    : '0';
  
  // Handle capital hall
  const capitalInfo = clan.clanCapital?.capitalHallLevel
    ? `${clan.clanCapital.capitalHallLevel}`
    : 'N/A';
    
  // Calculate win rate and create progress bar
  const totalWars = warWins + warTies + warLosses;
  const winRateRaw = totalWars > 0 ? (warWins / totalWars * 100).toFixed(1) : '0.0';
  // Escape decimal point for MarkdownV2
  const winRate = winRateRaw.replace('.', '\\.'); 
  
  // Get performance indicator based on win rate
  let performanceIndicator = '⚪'; // Default/no data
  if (totalWars > 0) {
    const winRateNum = parseFloat(winRateRaw);
    if (winRateNum >= 80) performanceIndicator = '🟢'; // Excellent
    else if (winRateNum >= 60) performanceIndicator = '🟢'; // Good
    else if (winRateNum >= 40) performanceIndicator = '🟡'; // Average
    else if (winRateNum >= 20) performanceIndicator = '🟠'; // Below average
    else performanceIndicator = '🔴'; // Poor
  }
  
  // Create win rate progress bar (10 chars width)
  let progressBar = '';
  if (totalWars > 0) {
    const filledChars = Math.round((warWins / totalWars) * 10);
    const emptyChars = 10 - filledChars;
    progressBar = `[${'■'.repeat(filledChars)}${'□'.repeat(emptyChars)}] ${winRate}% ${performanceIndicator}`;
  } else {
    progressBar = '[□□□□□□□□□□] 0\\.0% ⚪';
  }
  
  // Format win ratio text
  const winRatioText = `${warWins}\\-${warTies}\\-${warLosses}`;

  // Format clan points with escaped commas and dots
  const clanPointsFormatted = clan.clanPoints.toLocaleString().replace(/\./g, '\\.');
  const clanVersusPointsFormatted = clanVersusPoints.replace(/\./g, '\\.');

  return `
*${escapeMarkdown(clan.name)}* \\(${escapeMarkdown(clan.tag)}\\)
━━━━━━━━━━━━━━━━━

📋 *CLAN INFO*
📝 Description: ${escapeMarkdown(clan.description)}
🌍 Location: ${locationInfo}
👑 Level: ${clan.clanLevel}
👥 Members: ${clan.members}/50
🏆 Required Trophies: ${clan.requiredTrophies}

🏆 *POINTS*
🏅 Clan Points: ${clanPointsFormatted}
🏅 Builder Base Points: ${clanVersusPointsFormatted}
🏰 Capital Hall Level: ${capitalInfo}

⚔️ *WAR INFO*
🔰 War League: ${warLeagueInfo}
📊 War Frequency: ${escapeMarkdown(clan.warFrequency)}
🔍 War Log: ${clan.isWarLogPublic ? 'Public' : 'Private'}

📈 *WAR STATISTICS*
🏆 War Win Streak: ${clan.warWinStreak}
📊 Record: ${winRatioText} \\(W\\-T\\-L\\)
🔄 Win Rate: ${winRate}%
${progressBar}
`.trim();
}

/**
 * Format clan member list for display in Telegram
 */
export function formatClanMembers(members: ClanMember[] | ClanMemberList): string {
  // Handle different input types
  const memberArray = Array.isArray(members) ? members : members.items;
  
  if (!memberArray || memberArray.length === 0) {
    return 'No members data available';
  }

  // Sort members by clan rank
  const sortedMembers = [...memberArray].sort((a, b) => a.clanRank - b.clanRank);
  
  // Get top 10 members
  const topMembers = sortedMembers.slice(0, 20);
  
  const membersList = topMembers.map(member => {
    const name = escapeMarkdown(member.name);
    const role = escapeMarkdown(member.role);
    const rank = escapeMarkdown(member.clanRank.toString());
    // Ensure numbers are properly escaped for MarkdownV2
    const trophies = member.trophies.toString().replace(/\d(?=(\d{3})+$)/g, '$&,').replace(/\./g, '\\.');
    const donations = member.donations.toString().replace(/\d(?=(\d{3})+$)/g, '$&,').replace(/\./g, '\\.');
    
    return `${rank}\\. ${name} \\(${role}\\) \\- ${trophies} 🏆 \\| Donations: ${donations}`;
  }).join('\n');
  
  const remainingCount = memberArray.length - 20;
  const remainingText = remainingCount > 0 ? `\n_\\.\\.\\.and ${remainingCount} more members_` : '';
  
  return `
*Clan Members*
${membersList}${remainingText}
`.trim();
}

/**
 * Create inline keyboard for clan details
 */
export function createClanKeyboard(clanTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("👥 Members", `members_${clanTag}`)
    .text("🎖️ Top Donators", `donators_${clanTag}`)
    .row()
    .text("⚔️ War Log", `warlog_${clanTag}`)
    .text("🔥 Current War", `currentwar_${clanTag}`)
    .row()
    .text("👑 War League", `warleague_${clanTag}`)
    .text("🏰 Capital Raids", `capitalraids_${clanTag}`)
    .row()
    .text("🔄 Refresh", `back_to_clan_${clanTag}`);
}

/**
 * Create a back button for details views
 */
export function createBackToClanKeyboard(clanTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("« Back to Clan Info", `back_to_clan_${clanTag}`)
    .text("🔄 Refresh", `back_to_clan_${clanTag}`);
}

/**
 * Format top donators from clan
 */
export function formatTopDonators(members: ClanMember[] | ClanMemberList): string {
  // Handle different input types
  const memberArray = Array.isArray(members) ? members : members.items;
  
  if (!memberArray || memberArray.length === 0) {
    return 'No members data available';
  }

  // Sort members by donations (highest first)
  const sortedMembers = [...memberArray]
    .sort((a, b) => b.donations - a.donations);
  
  // Get top 10 donators
  const topDonators = sortedMembers.slice(0, 10);
  
  const donatorsList = topDonators.map(member => 
    `${escapeMarkdown(member.name)} \\(${escapeMarkdown(member.role)}\\): ${member.donations.toString().replace(/\d(?=(\d{3})+$)/g, '$&,').replace(/\./g, '\\.')} donated \\| ${member.donationsReceived.toString().replace(/\d(?=(\d{3})+$)/g, '$&,').replace(/\./g, '\\.')} received`
  ).join('\n');
  
  return `
*Top Donators*
${donatorsList}
`.trim();
}

/**
 * Format clan war log
 */
export function formatClanWarLog(warLog: WarLog, clanName: string): string {
  if (!warLog.items || warLog.items.length === 0) {
    return 'No war log data available or war log is private';
  }
  
  // Get the most recent 5 wars
  const recentWars = warLog.items.slice(0, 5);
  
  const warsList = recentWars.map(war => {
    const result = war.result === 'win' ? '✅ Won' : war.result === 'lose' ? '❌ Lost' : '🤝 Tied';
    const endDate = new Date(war.endTime).toLocaleDateString();
    const clanDestruction = war.clan.destructionPercentage.toFixed(2).replace('.', '\\.');
    const opponentDestruction = war.opponent.destructionPercentage.toFixed(2).replace('.', '\\.');
    return `${result} vs ${escapeMarkdown(war.opponent.name)} \\(${war.teamSize}v${war.teamSize}\\) \\- ${endDate}
    Stars: ${war.clan.stars}⭐ \\- ${war.opponent.stars}⭐
    Destruction: ${clanDestruction}% \\- ${opponentDestruction}%`;
  }).join('\n\n');
  
  return `
*Recent Wars for ${escapeMarkdown(clanName)}*

${warsList}
`.trim();
}

/**
 * Format current war info
 */
export function formatCurrentWar(war: ClanWar): string {
  if (!war || war.state === 'notInWar') {
    return 'This clan is not currently in war';
  }
  
  const clanName = escapeMarkdown(war.clan.name);
  const opponentName = escapeMarkdown(war.opponent.name);
  
  let status = '';
  let timeInfo = '';
  
  if (war.state === 'preparation') {
    const preparationEndTime = new Date(war.startTime).getTime();
    const now = Date.now();
    const hoursLeft = Math.floor((preparationEndTime - now) / (1000 * 60 * 60));
    const minutesLeft = Math.floor(((preparationEndTime - now) % (1000 * 60 * 60)) / (1000 * 60));
    
    status = '🔄 *Preparation Day*';
    timeInfo = `War starts in: ${hoursLeft}h ${minutesLeft}m`;
  } else if (war.state === 'inWar') {
    const warEndTime = new Date(war.endTime).getTime();
    const now = Date.now();
    const hoursLeft = Math.floor((warEndTime - now) / (1000 * 60 * 60));
    const minutesLeft = Math.floor(((warEndTime - now) % (1000 * 60 * 60)) / (1000 * 60));
    
    status = '⚔️ *Battle Day*';
    timeInfo = `War ends in: ${hoursLeft}h ${minutesLeft}m`;
  } else if (war.state === 'warEnded') {
    status = '🏁 *War Ended*';
    timeInfo = `Result: ${war.result === 'win' ? 'Victory!' : war.result === 'lose' ? 'Defeat' : 'Tie'}`;
  }
  
  const clanStars = war.clan.stars || 0;
  const opponentStars = war.opponent.stars || 0;
  
  const clanDestruction = (war.clan.destructionPercentage?.toFixed(2) || '0.00').replace('.', '\\.');
  const opponentDestruction = (war.opponent.destructionPercentage?.toFixed(2) || '0.00').replace('.', '\\.');
  
  const clanAttacks = war.clan.attacks || 0;
  const totalPossibleAttacks = war.teamSize * 2;
  
  return `
*${clanName} vs ${opponentName}*
${status}
${timeInfo}

*Team Size:* ${war.teamSize}v${war.teamSize}

*${clanName}*
⭐ Stars: ${clanStars}
💥 Destruction: ${clanDestruction}%
⚔️ Attacks Used: ${clanAttacks}/${totalPossibleAttacks}

*${opponentName}*
⭐ Stars: ${opponentStars}
💥 Destruction: ${opponentDestruction}%
`.trim();
}

/**
 * Format clan capital raid season
 */
export function formatCapitalRaidSeason(season: CapitalRaidSeason, clanName: string): string {
  const startDate = new Date(season.startTime).toLocaleDateString();
  const endDate = new Date(season.endTime).toLocaleDateString();
  
  return `
*Clan Capital Raid Season for ${escapeMarkdown(clanName)}*
📅 ${startDate} \\- ${endDate}

🏆 Capital Total Loot: ${season.capitalTotalLoot}
🎖️ Offensive Reward: ${season.offensiveReward}
🛡️ Defensive Reward: ${season.defensiveReward}
⚔️ Raids Completed: ${season.raidsCompleted}
🗡️ Total Attacks: ${season.totalAttacks}
🏙️ Enemy Districts Destroyed: ${season.enemyDistrictsDestroyed}
`.trim();
}

/**
 * Format clan search results
 */
export function formatClanSearchResults(results: ClanSearchResult): string {
  if (!results.items || results.items.length === 0) {
    return 'No clans found matching your criteria';
  }
  
  // Show first 5 results
  const clans = results.items.slice(0, 5);
  
  const clansList = clans.map(clan => {
    return `*${escapeMarkdown(clan.name)}* \\(${escapeMarkdown(clan.tag)}\\)
👑 Level: ${clan.clanLevel}
👥 Members: ${clan.members}/50
🏆 Trophies: ${clan.clanPoints}
${clan.location ? `🌍 Location: ${escapeMarkdown(clan.location.name)}` : ''}`;
  }).join('\n\n');
  
  return `
*Clan Search Results*

${clansList}
${results.items.length > 5 ? `\n_...and ${results.items.length - 5} more clans_` : ''}
`.trim();
}

/**
 * Format clan war league group
 */
export function formatClanWarLeagueGroup(leagueGroup: ClanWarLeagueGroup): string {
  if (!leagueGroup || !leagueGroup.clans || leagueGroup.clans.length === 0) {
    return 'No clan war league data available';
  }
  
  const season = leagueGroup.season || 'Current';
  
  // Sort clans by name
  const sortedClans = [...leagueGroup.clans].sort((a, b) => a.name.localeCompare(b.name));
  
  const clansList = sortedClans.map(clan => {
    return `• ${escapeMarkdown(clan.name)} \\(${escapeMarkdown(clan.tag)}\\)`;
  }).join('\n');
  
  return `
*Clan War League Group \\- Season ${season}*

*Clans in group:*
${clansList}

*Rounds:* ${leagueGroup.rounds ? leagueGroup.rounds.length : 'Unknown'}
`.trim();
}

/**
 * Format clan rankings
 */
export function formatClanRankings(rankings: ClanRankingList): string {
  if (!rankings.items || rankings.items.length === 0) {
    return 'No clan ranking data available';
  }
  
  const rankingsList = rankings.items.slice(0, 10).map(clan => {
    const name = escapeMarkdown(clan.name);
    const rank = escapeMarkdown(clan.rank.toString());
    const locationInfo = clan.location ? ` \\| ${escapeMarkdown(clan.location.name)}` : '';
    return `${rank}\\. ${name} \\- ${clan.clanPoints} 🏆 \\| Lvl ${clan.clanLevel}${locationInfo}`;
  }).join('\n');
  
  const remainingCount = rankings.items.length - 10;
  const remainingText = remainingCount > 0 ? `\n_\\.\\.\\.and ${remainingCount} more clans_` : '';
  
  return `
*Top Ranked Clans*

${rankingsList}${remainingText}
`.trim();
}

/**
 * Format clan versus rankings
 */
export function formatClanVersusRankings(rankings: ClanVersusRankingList): string {
  if (!rankings.items || rankings.items.length === 0) {
    return 'No clan versus ranking data available';
  }
  
  const rankingsList = rankings.items.slice(0, 10).map(clan => {
    const name = escapeMarkdown(clan.name);
    const rank = escapeMarkdown(clan.rank.toString());
    const locationInfo = clan.location ? ` \\| ${escapeMarkdown(clan.location.name)}` : '';
    return `${rank}\\. ${name} \\- ${clan.clanVersusPoints} 🏆 \\| Lvl ${clan.clanLevel}${locationInfo}`;
  }).join('\n');
  
  const remainingCount = rankings.items.length - 10;
  const remainingText = remainingCount > 0 ? `\n_\\.\\.\\.and ${remainingCount} more clans_` : '';
  
  return `
*Top Ranked Builder Base Clans*

${rankingsList}${remainingText}
`.trim();
}

/**
 * Create inline keyboard for clan search results
 */
export function createClanSearchResultsKeyboard(clans: Clan[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  
  clans.slice(0, 5).forEach((clan, index) => {
    keyboard.text(`${index + 1}. ${clan.name}`, `clan_${clan.tag}`);
    if (index < 4) keyboard.row();
  });
  
  return keyboard;
}

export default {
  escapeMarkdown,
  formatClanInfo,
  formatClanMembers,
  formatTopDonators,
  formatClanWarLog,
  formatCurrentWar,
  formatCapitalRaidSeason,
  formatClanSearchResults,
  formatClanWarLeagueGroup,
  formatClanRankings,
  formatClanVersusRankings,
  createClanKeyboard,
  createBackToClanKeyboard,
  createClanSearchResultsKeyboard,
}; 