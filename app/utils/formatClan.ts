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
  
  // Format clan versus points (commented out due to issues)
  // const clanVersusPoints = clan.clanVersusPoints !== undefined 
  //   ? clan.clanVersusPoints.toLocaleString() 
  //   : 'N/A';
  
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
  // Comment out versus points - causing issues
  // const clanVersusPointsFormatted = clanVersusPoints.replace(/\./g, '\\.');

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
🏰 Capital Hall Level: ${capitalInfo}
${/* 🏅 Builder Base Points: commented out due to issues */``}
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
export function formatClanMembers(members: ClanMember[] | ClanMemberList, page: number = 1): string {
  // Handle different input types
  const memberArray = Array.isArray(members) ? members : members.items;
  
  if (!memberArray || memberArray.length === 0) {
    return 'No members data available';
  }

  // Sort members by clan rank
  const sortedMembers = [...memberArray].sort((a, b) => a.clanRank - b.clanRank);
  
  // Calculate pagination
  const pageSize = 10;
  const totalPages = Math.ceil(sortedMembers.length / pageSize);
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (validPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, sortedMembers.length);
  
  // Get members for current page
  const pageMembers = sortedMembers.slice(startIdx, endIdx);
  
  // Helper function to get league based on trophies
  const getLeague = (trophies: number): string => {
    if (trophies >= 5000) return 'Legend';
    if (trophies >= 4100) return 'Titan';
    if (trophies >= 3100) return 'Champion';
    if (trophies >= 2600) return 'Master';
    if (trophies >= 2000) return 'Crystal';
    if (trophies >= 1400) return 'Gold';
    if (trophies >= 800) return 'Silver';
    return 'Bronze';
  };

  // Helper function to get league icon
  const getLeagueIcon = (trophies: number): string => {
    if (trophies >= 5000) return '🔮';
    if (trophies >= 4100) return '💎';
    if (trophies >= 3100) return '🏆';
    if (trophies >= 2600) return '🥇';
    if (trophies >= 2000) return '🥈';
    if (trophies >= 1400) return '🥉';
    if (trophies >= 800) return '🔷';
    return '🔶';
  };
  
  // Helper function to format donations
  const formatDonations = (sent: number, received: number): string => {
    if (sent === 0 && received === 0) return '📦 No donations';
    
    let result = '';
    if (sent > 0) result += `📦 ${sent.toLocaleString().replace(/\./g, '\\.')} sent`;
    if (sent > 0 && received > 0) result += ' \\| ';
    if (received > 0) result += `📥 ${received.toLocaleString().replace(/\./g, '\\.')} received`;
    
    // Add donation ratio if both values are present and non-zero
    if (sent > 0 && received > 0) {
      const ratio = (sent / received).toFixed(1).replace(/\./g, '\\.');
      if (ratio !== '1\\.0') {
        result += ` \\(${ratio}x\\)`;
      } else {
        result += ` \\(1x\\)`;
      }
    }
    
    return result;
  };
  
  // Format each member
  const membersList = pageMembers.map(member => {
    const name = escapeMarkdown(member.name);
    const rank = escapeMarkdown(member.clanRank.toString());
    const trophies = member.trophies.toLocaleString().replace(/\./g, '\\.');
    const league = getLeague(member.trophies);
    const leagueIcon = getLeagueIcon(member.trophies);
    
    // Determine role icon
    let roleIcon = '👤';
    if (member.role === 'leader') roleIcon = '👑';
    else if (member.role === 'coLeader') roleIcon = '⭐';
    else if (member.role === 'admin') roleIcon = '🔱';
    
    // Calculate rank change
    let rankChangeIcon = '•';
    if (member.clanRank < member.previousClanRank) rankChangeIcon = '⬆️';
    else if (member.clanRank > member.previousClanRank) rankChangeIcon = '⬇️';
    
    // Format donations
    const donations = formatDonations(member.donations, member.donationsReceived);
    
    return `${rank}\\. ${roleIcon} ${name} ${rankChangeIcon}
${leagueIcon} ${trophies} trophies \\| ${league} League
${donations}
──────────`;
  }).join('\n');
  
  // Get range information
  const showingStart = startIdx + 1;
  const showingEnd = endIdx;
  const totalMembers = memberArray.length;
  
  // Create summary of clan composition
  let roleCount = {
    leader: 0,
    coLeader: 0,
    admin: 0,
    member: 0
  };
  
  sortedMembers.forEach(member => {
    if (member.role in roleCount) {
      roleCount[member.role as keyof typeof roleCount]++;
    }
  });
  
  // Calculate average donations
  const totalDonations = sortedMembers.reduce((sum, member) => sum + member.donations, 0);
  const avgDonations = totalMembers > 0 ? Math.round(totalDonations / totalMembers) : 0;
  
  // Create detailed footer with statistics
  const details = `
📋 *Members Breakdown*
👑 Leader: ${roleCount.leader}
⭐ Co\\-Leaders: ${roleCount.coLeader}
🔱 Elders: ${roleCount.admin}
👤 Members: ${roleCount.member}

📊 *Stats*
📦 Total Donations: ${totalDonations.toLocaleString().replace(/\./g, '\\.')}
📈 Average Donations: ${avgDonations.toLocaleString().replace(/\./g, '\\.')}
📋 Page ${validPage}/${totalPages} \\| Showing members ${showingStart}\\-${showingEnd} of ${totalMembers}

📖 *Symbol Legend*
Roles: 👑 Leader \\| ⭐ Co\\-Leader \\| 🔱 Elder \\| 👤 Member
Rank Change: ⬆️ Promoted \\| ⬇️ Demoted \\| • No change
Leagues: 🔮 Legend \\| 💎 Titan \\| 🏆 Champion \\| 🥇 Master \\| 🥈 Crystal \\| 🥉 Gold \\| 🔷 Silver \\| 🔶 Bronze`;
  
  return `
*Clan Members*

${membersList}

${details}
`.trim();
}

/**
 * Create pagination keyboard for clan members
 */
export function createClanMembersKeyboard(clanTag: string, currentPage: number, totalMembers: number): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  const totalPages = Math.ceil(totalMembers / 10);
  
  // First page button (if not on first page)
  if (currentPage > 1) {
    keyboard.text("« First", `members_${clanTag}_1`);
  }
  
  // Previous page button
  if (currentPage > 1) {
    keyboard.text("‹ Prev", `members_${clanTag}_${currentPage - 1}`);
  }
  
  // Current page indicator (non-clickable)
  keyboard.text(`${currentPage}/${totalPages}`, `members_page_info`);
  
  // Next page button
  if (currentPage < totalPages) {
    keyboard.text("Next ›", `members_${clanTag}_${currentPage + 1}`);
  }
  
  // Last page button (if not on last page)
  if (currentPage < totalPages) {
    keyboard.text("Last »", `members_${clanTag}_${totalPages}`);
  }
  
  // Add second row with back button and refresh
  keyboard.row()
    .text("« Back to Clan", `back_to_clan_${clanTag}`)
    .text("🔄 Refresh", `members_${clanTag}_${currentPage}`);
  
  return keyboard;
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
export function formatTopDonators(members: ClanMember[] | ClanMemberList, page: number = 1): string {
  // Handle different input types
  const memberArray = Array.isArray(members) ? members : members.items;
  
  if (!memberArray || memberArray.length === 0) {
    return 'No members data available';
  }

  // Sort members by donations (highest first)
  const sortedMembers = [...memberArray].sort((a, b) => b.donations - a.donations);
  
  // Calculate pagination
  const pageSize = 10;
  const totalPages = Math.ceil(sortedMembers.length / pageSize);
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIdx = (validPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, sortedMembers.length);
  
  // Get donators for current page
  const pageDonators = sortedMembers.slice(startIdx, endIdx);

  // Helper function to get league icon
  const getLeagueIcon = (trophies: number): string => {
    if (trophies >= 5000) return '🔮';
    if (trophies >= 4100) return '💎';
    if (trophies >= 3100) return '🏆';
    if (trophies >= 2600) return '🥇';
    if (trophies >= 2000) return '🥈';
    if (trophies >= 1400) return '🥉';
    if (trophies >= 800) return '🔷';
    return '🔶';
  };
  
  // Format each donator with improved UI
  const donatorsList = pageDonators.map((member, index) => {
    const position = startIdx + index + 1;
    const name = escapeMarkdown(member.name);
    
    // Determine role icon
    let roleIcon = '👤';
    if (member.role === 'leader') roleIcon = '👑';
    else if (member.role === 'coLeader') roleIcon = '⭐';
    else if (member.role === 'admin') roleIcon = '🔱';
    
    // Format donation numbers with commas and escaping
    const donations = member.donations.toLocaleString().replace(/\./g, '\\.');
    const received = member.donationsReceived.toLocaleString().replace(/\./g, '\\.');
    
    // Calculate donation ratio
    let ratio = 0;
    let ratioText = '';
    if (member.donationsReceived > 0) {
      ratio = member.donations / member.donationsReceived;
      ratioText = ratio.toFixed(1).replace(/\./g, '\\.');
      ratioText = ` \\(${ratioText}x\\)`;
    }
    
    // Calculate donation efficiency
    const efficiency = ratio >= 1 ? '✅' : '❗';
    
    // Get league icon
    const leagueIcon = getLeagueIcon(member.trophies);
    
    return `${position}\\. ${roleIcon} ${name} ${leagueIcon}
📦 ${donations} donated \\| 📥 ${received} received${ratioText} ${efficiency}
──────────`;
  }).join('\n');
  
  // Calculate donation statistics
  const totalDonations = memberArray.reduce((sum, member) => sum + member.donations, 0);
  const totalReceived = memberArray.reduce((sum, member) => sum + member.donationsReceived, 0);
  const avgDonations = Math.round(totalDonations / memberArray.length);
  const avgReceived = Math.round(totalReceived / memberArray.length);
  
  // Find top donor
  const topDonor = sortedMembers.length > 0 ? sortedMembers[0] : null;
  
  // Find members with no donations
  const zeroDonors = memberArray.filter(member => member.donations === 0).length;
  const zeroDonorsPercent = Math.round((zeroDonors / memberArray.length) * 100);
  
  // Get range information
  const showingStart = startIdx + 1;
  const showingEnd = endIdx;
  const totalMembers = memberArray.length;
  
  // Create detailed footer with statistics
  const details = `
📊 *Donation Statistics*
📦 Total Donations: ${totalDonations.toLocaleString().replace(/\./g, '\\.')}
📥 Total Received: ${totalReceived.toLocaleString().replace(/\./g, '\\.')}
📈 Average Donations: ${avgDonations.toLocaleString().replace(/\./g, '\\.')}
📉 Average Received: ${avgReceived.toLocaleString().replace(/\./g, '\\.')}
${topDonor ? `🥇 Top Donor: ${escapeMarkdown(topDonor.name)} \\(${topDonor.donations.toLocaleString().replace(/\./g, '\\.')}\\)` : ''}
❗ Members with Zero Donations: ${zeroDonors} \\(${zeroDonorsPercent}%\\)

📋 Page ${validPage}/${totalPages} \\| Showing ${showingStart}\\-${showingEnd} of ${totalMembers}

📖 *Symbol Legend*
Roles: 👑 Leader \\| ⭐ Co\\-Leader \\| 🔱 Elder \\| 👤 Member
Efficiency: ✅ Good ratio \\(≥1\\) \\| ❗ Needs improvement \\(<1\\)
Leagues: 🔮 Legend \\| 💎 Titan \\| 🏆 Champion \\| 🥇 Master \\| 🥈 Crystal \\| 🥉 Gold \\| 🔷 Silver \\| 🔶 Bronze`;
  
  return `
*Top Donators*

${donatorsList}

${details}
`.trim();
}

/**
 * Create pagination keyboard for top donators
 */
export function createTopDonatorsKeyboard(clanTag: string, currentPage: number, totalMembers: number): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  const totalPages = Math.ceil(totalMembers / 10);
  
  // First page button (if not on first page)
  if (currentPage > 1) {
    keyboard.text("« First", `donators_${clanTag}_1`);
  }
  
  // Previous page button
  if (currentPage > 1) {
    keyboard.text("‹ Prev", `donators_${clanTag}_${currentPage - 1}`);
  }
  
  // Current page indicator (non-clickable)
  keyboard.text(`${currentPage}/${totalPages}`, `donators_page_info`);
  
  // Next page button
  if (currentPage < totalPages) {
    keyboard.text("Next ›", `donators_${clanTag}_${currentPage + 1}`);
  }
  
  // Last page button (if not on last page)
  if (currentPage < totalPages) {
    keyboard.text("Last »", `donators_${clanTag}_${totalPages}`);
  }
  
  // Add second row with back button and refresh
  keyboard.row()
    .text("« Back to Clan", `back_to_clan_${clanTag}`)
    .text("🔄 Refresh", `donators_${clanTag}_${currentPage}`);
  
  return keyboard;
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
  createClanMembersKeyboard,
  createTopDonatorsKeyboard,
}; 