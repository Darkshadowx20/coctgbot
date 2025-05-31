import { Clan, ClanMember } from '../types/coc.js';
import { InlineKeyboard } from 'grammy';

/**
 * Escape special Markdown characters
 */
function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
}

/**
 * Format clan data for display in Telegram
 */
export function formatClanInfo(clan: Clan): string {
  const warLeagueInfo = clan.warLeague 
    ? `\n🏆 War League: ${escapeMarkdown(clan.warLeague.name)}` 
    : '\n🏆 War League: None';

  const locationInfo = clan.location 
    ? `\n🌍 Location: ${escapeMarkdown(clan.location.name)}` 
    : '\n🌍 Location: Not set';

  return `
*${escapeMarkdown(clan.name)}* (${clan.tag})
📝 Description: ${escapeMarkdown(clan.description)}
${locationInfo}
👑 Level: ${clan.clanLevel}
👥 Members: ${clan.members}/50
🏆 Clan Points: ${clan.clanPoints}
🏆 Clan Versus Points: ${clan.clanVersusPoints}
${warLeagueInfo}
⚔️ War Frequency: ${escapeMarkdown(clan.warFrequency)}
🏅 War Win Streak: ${clan.warWinStreak}
🎖️ War Wins: ${clan.warWins}
${clan.warTies !== undefined ? `🤝 War Ties: ${clan.warTies}\n` : ''}${clan.warLosses !== undefined ? `❌ War Losses: ${clan.warLosses}\n` : ''}🔍 War Log: ${clan.isWarLogPublic ? 'Public' : 'Private'}
🏆 Required Trophies: ${clan.requiredTrophies}
`.trim();
}

/**
 * Format clan member list for display in Telegram
 */
export function formatClanMembers(clan: Clan): string {
  if (!clan.memberList || clan.memberList.length === 0) {
    return 'No members data available';
  }

  // Sort members by clan rank
  const sortedMembers = [...clan.memberList].sort((a, b) => a.clanRank - b.clanRank);
  
  // Get top 10 members
  const topMembers = sortedMembers.slice(0, 10);
  
  const membersList = topMembers.map(member => 
    `${member.clanRank}. ${escapeMarkdown(member.name)} (${escapeMarkdown(member.role)}) - ${member.trophies} 🏆 | Donations: ${member.donations}`
  ).join('\n');
  
  return `
*Top Members of ${escapeMarkdown(clan.name)}*
${membersList}
${clan.members > 10 ? `\n_...and ${clan.members - 10} more members_` : ''}
`.trim();
}

/**
 * Create inline keyboard for clan details
 */
export function createClanKeyboard(clanTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("Members", `members_${clanTag}`)
    .text("Top Donators", `donators_${clanTag}`)
    .row()
    .text("War Log", `warlog_${clanTag}`)
    .text("Current War", `currentwar_${clanTag}`);
}

/**
 * Create a back button for details views
 */
export function createBackToClanKeyboard(clanTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("« Back to Clan Info", `back_to_clan_${clanTag}`);
}

/**
 * Format top donators from clan
 */
export function formatTopDonators(clan: Clan): string {
  if (!clan.memberList || clan.memberList.length === 0) {
    return 'No members data available';
  }

  // Sort members by donations (highest first)
  const sortedMembers = [...clan.memberList]
    .sort((a, b) => b.donations - a.donations);
  
  // Get top 10 donators
  const topDonators = sortedMembers.slice(0, 10);
  
  const donatorsList = topDonators.map(member => 
    `${escapeMarkdown(member.name)} (${escapeMarkdown(member.role)}): ${member.donations} donated | ${member.donationsReceived} received`
  ).join('\n');
  
  return `
*Top Donators of ${escapeMarkdown(clan.name)}*
${donatorsList}
`.trim();
}

export default {
  formatClanInfo,
  formatClanMembers,
  formatTopDonators,
  createClanKeyboard,
  createBackToClanKeyboard,
}; 