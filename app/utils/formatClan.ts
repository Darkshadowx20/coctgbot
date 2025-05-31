import { Clan, ClanMember } from '../types/coc.js';

/**
 * Format clan data for display in Telegram
 */
export function formatClanInfo(clan: Clan): string {
  const warLeagueInfo = clan.warLeague 
    ? `\n🏆 War League: ${clan.warLeague.name}` 
    : '\n🏆 War League: None';

  const locationInfo = clan.location 
    ? `\n🌍 Location: ${clan.location.name}` 
    : '\n🌍 Location: Not set';

  return `
*${clan.name}* (${clan.tag})
📝 Description: ${clan.description}
${locationInfo}
👑 Level: ${clan.clanLevel}
👥 Members: ${clan.members}/50
🏆 Clan Points: ${clan.clanPoints}
🏆 Clan Versus Points: ${clan.clanVersusPoints}
${warLeagueInfo}
⚔️ War Frequency: ${clan.warFrequency}
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
    `${member.clanRank}. ${member.name} (${member.role}) - ${member.trophies} 🏆 | Donations: ${member.donations}`
  ).join('\n');
  
  return `
*Top Members of ${clan.name}*
${membersList}
${clan.members > 10 ? `\n_...and ${clan.members - 10} more members_` : ''}
`.trim();
}

export default {
  formatClanInfo,
  formatClanMembers,
}; 