import { 
  Player, 
  PlayerRankingList, 
  PlayerVersusBattleRankingList,
  LeagueRankingList,
  Troop,
  GoldPassSeason
} from '../types/coc.js';
import { InlineKeyboard } from 'grammy';
import { escapeMarkdown } from './formatClan.js';

/**
 * Format player data for display in Telegram
 */
export function formatPlayerInfo(player: Player): string {
  // Clan section with better formatting
  const clanInfo = player.clan 
    ? `\n🛡️ *Clan:* ${escapeMarkdown(player.clan.name)} \\(${escapeMarkdown(player.clan.tag)}\\)`
    : '\n🛡️ *Clan:* None';
  
  // League section with better formatting
  const leagueInfo = player.league 
    ? `\n🏆 *League:* ${escapeMarkdown(player.league.name)}` 
    : '\n🏆 *League:* None';

  // Main village stats with better formatting and organization
  const mainVillageStats = `
👑 *Experience Level:* ${player.expLevel}
🏠 *Town Hall:* ${player.townHallLevel}
🏆 *Trophies:* ${player.trophies}
🏅 *Best Trophies:* ${player.bestTrophies}
⭐ *War Stars:* ${player.warStars}
⚔️ *Attack Wins:* ${player.attackWins}
🛡️ *Defense Wins:* ${player.defenseWins}`;

  // Role and donations with better formatting
  const roleAndDonations = `${player.role ? `\n👤 *Role:* ${escapeMarkdown(player.role)}` : ''}${player.donations !== undefined ? `\n📦 *Donations:* ${player.donations}` : ''}${player.donationsReceived !== undefined ? `\n📥 *Donations Received:* ${player.donationsReceived}` : ''}`;

  // Improved Builder Base section with proper undefined checks and better formatting
  let builderBaseInfo = '';
  if (player.builderHallLevel) {
    builderBaseInfo = '\n\n*📊 Builder Base*';
    builderBaseInfo += `\n🏠 *Builder Hall:* ${player.builderHallLevel}`;
    
    // Check for builderBaseTrophies first (newer API), fall back to versusTrophies (older API)
    if (typeof player.builderBaseTrophies === 'number') {
      builderBaseInfo += `\n🏆 *Versus Trophies:* ${player.builderBaseTrophies}`;
    } else if (typeof player.versusTrophies === 'number') {
      builderBaseInfo += `\n🏆 *Versus Trophies:* ${player.versusTrophies}`;
    }
    
    // Check for bestBuilderBaseTrophies first (newer API), fall back to bestVersusTrophies (older API)
    if (typeof player.bestBuilderBaseTrophies === 'number') {
      builderBaseInfo += `\n🏅 *Best Versus Trophies:* ${player.bestBuilderBaseTrophies}`;
    } else if (typeof player.bestVersusTrophies === 'number') {
      builderBaseInfo += `\n🏅 *Best Versus Trophies:* ${player.bestVersusTrophies}`;
    }
    
    if (typeof player.versusBattleWins === 'number') {
      builderBaseInfo += `\n⚔️ *Versus Battle Wins:* ${player.versusBattleWins}`;
    }
  }

  // Combine all sections with proper spacing
  return `
*${escapeMarkdown(player.name)}* \\(${escapeMarkdown(player.tag)}\\)
${clanInfo}
${leagueInfo}
${mainVillageStats}
${roleAndDonations}
${builderBaseInfo}
`.trim();
}

/**
 * Format Gold Pass status for display
 */
export function formatGoldPassStatus(goldPass: GoldPassSeason): string {
  const now = new Date();
  
  // Parse dates safely with fallback
  let startTime: Date;
  let endTime: Date;
  
  try {
    // Try ISO format first
    startTime = new Date(goldPass.startTime);
    endTime = new Date(goldPass.endTime);
    
    // Check if dates are valid
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new Error('Invalid date format');
    }
  } catch (error) {
    // Fallback to current month/next month if parsing fails
    console.error('Error parsing Gold Pass dates:', error);
    startTime = new Date();
    startTime.setDate(1); // First day of current month
    
    endTime = new Date();
    endTime.setMonth(endTime.getMonth() + 1); // Next month
    endTime.setDate(0); // Last day of current month
  }
  
  // Calculate days remaining
  const daysRemaining = Math.ceil((endTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format dates in a readable way
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  // Check if Gold Pass is active
  const isActive = now >= startTime && now <= endTime;
  const statusEmoji = isActive ? '✅' : '❌';
  const statusText = isActive ? 'Active' : 'Inactive';
  
  // Create progress bar for days remaining
  let progressBar = '';
  if (isActive) {
    const totalDays = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = totalDays - daysRemaining;
    const progressPercentage = Math.floor((daysPassed / totalDays) * 100);
    
    const filledBlocks = Math.floor(progressPercentage / 10);
    const emptyBlocks = 10 - filledBlocks;
    
    progressBar = `\n*Progress:* [${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)}] ${progressPercentage}%`;
  }
  
  return `
*🏅 Gold Pass Season*

${statusEmoji} *Status:* ${statusText}
📅 *Start Date:* ${formatDate(startTime)}
🗓️ *End Date:* ${formatDate(endTime)}
${isActive ? `⏳ *Days Remaining:* ${daysRemaining}${progressBar}` : '🔜 *Next Season:* Coming soon'}
`.trim();
}

/**
 * Create inline keyboard for player details with Gold Pass button
 */
export function createPlayerKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("🪖 Troops", `troops_${playerTag}`)
    .text("👑 Heroes", `heroes_${playerTag}`)
    .row()
    .text("🧪 Spells", `spells_${playerTag}`)
    .text("🏆 Achievements", `achievements_${playerTag}`)
    .row()
    .text("🏠 Builder Base", `builder_base_${playerTag}`)
    .text("🏅 Gold Pass", `gold_pass_${playerTag}`);
}

/**
 * Create a back button for details views
 */
export function createBackToPlayerKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("« Back to Player Info", `back_to_player_${playerTag}`);
}

/**
 * Create inline keyboard for troop types
 */
export function createTroopTypesKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("💧 Elixir Troops", `elixir_troops_${playerTag}`)
    .text("🖤 Dark Troops", `dark_troops_${playerTag}`)
    .row()
    .text("🐾 Hero Pets", `hero_pets_${playerTag}`)
    .text("🛠️ Siege Machines", `siege_machines_${playerTag}`)
    .row()
    .text("🪖 All Troops", `all_troops_${playerTag}`)
    .text("« Back", `back_to_player_${playerTag}`);
}

/**
 * Format player troops for display in Telegram
 */
export function formatPlayerTroops(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No troop data available';
  }

  // Filter home village troops (exclude super troops)
  const homeVillageTroops = player.troops.filter(troop => 
    troop.village === 'home' && !troop.name.startsWith('Super')
  );
  
  // Identify hero pets, siege machines, and regular troops
  const heroPets = homeVillageTroops.filter(troop => 
    ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn', 
    'Frosty', 'Diggy', 'Poison Lizard', 'Phoenix', 
    'Spirit Fox', 'Angry Jelly', 'Sneezy'].includes(troop.name)
  );
  
  const siegeMachines = homeVillageTroops.filter(troop => 
    ['Wall Wrecker', 'Battle Blimp', 'Stone Slammer', 'Siege Barracks',
    'Log Launcher', 'Flame Flinger', 'Battle Drill', 'Troop Launcher'].includes(troop.name)
  );
  
  // Define elixir troops and dark elixir troops
  const elixirTroops = homeVillageTroops.filter(troop => 
    ['Barbarian', 'Archer', 'Giant', 'Goblin', 'Wall Breaker', 
    'Balloon', 'Wizard', 'Healer', 'Dragon', 'P.E.K.K.A', 'Baby Dragon', 
    'Miner', 'Electro Dragon', 'Yeti', 'Dragon Rider', 'Electro Titan',
    'Root Rider', 'Thrower'].includes(troop.name)
  );
  
  const darkElixirTroops = homeVillageTroops.filter(troop => 
    ['Minion', 'Hog Rider', 'Valkyrie', 'Golem', 'Witch', 'Lava Hound', 
    'Bowler', 'Ice Golem', 'Headhunter', 'Apprentice Warden', 'Druid', 
    'Furnace'].includes(troop.name)
  );
  
  // Map troop names to emojis
  const troopEmojis: {[key: string]: string} = {
    // Elixir troops
    'Barbarian': '⚔️',
    'Archer': '🏹',
    'Giant': '💪',
    'Goblin': '💰',
    'Wall Breaker': '💣',
    'Balloon': '🎈',
    'Wizard': '🧙',
    'Healer': '💗',
    'Dragon': '🐉',
    'P.E.K.K.A': '🤖',
    'Baby Dragon': '🐲',
    'Miner': '⛏️',
    'Electro Dragon': '⚡',
    'Yeti': '❄️',
    'Dragon Rider': '🐉',
    'Electro Titan': '⚡',
    'Root Rider': '🌱',
    'Thrower': '🔥',
    
    // Dark troops
    'Minion': '🦇',
    'Hog Rider': '🐗',
    'Valkyrie': '🔴',
    'Golem': '🪨',
    'Witch': '🧙‍♀️',
    'Lava Hound': '🌋',
    'Bowler': '🎳',
    'Ice Golem': '☃️',
    'Headhunter': '🏹',
    'Apprentice Warden': '📚',
    'Druid': '🌿',
    'Furnace': '🔥',
    
    // Hero pets
    'L.A.S.S.I': '🐕',
    'Electro Owl': '🦉',
    'Mighty Yak': '🐃',
    'Unicorn': '🦄',
    'Frosty': '❄️',
    'Diggy': '🦔',
    'Poison Lizard': '🦎',
    'Phoenix': '🔥',
    'Spirit Fox': '🦊',
    'Angry Jelly': '🫠',
    'Sneezy': '🤧',
    
    // Siege machines
    'Wall Wrecker': '🚚',
    'Battle Blimp': '🎈',
    'Stone Slammer': '🪨',
    'Siege Barracks': '🏛️',
    'Log Launcher': '🪵',
    'Flame Flinger': '🔥',
    'Battle Drill': '⚙️',
    'Troop Launcher': '🚀'
  };
  
  // Format sections
  const formatSection = (troops: Troop[], title: string): string => {
    if (troops.length === 0) return '';
    
    const sortedTroops = [...troops].sort((a, b) => a.name.localeCompare(b.name));
    const troopsList = sortedTroops.map(troop => {
      const maxLevelIndicator = troop.level === troop.maxLevel ? ' ✅' : '';
      const emoji = troopEmojis[troop.name] || '🪖'; // Default emoji
      return `${emoji} ${escapeMarkdown(troop.name)}: ${troop.level}/${troop.maxLevel}${maxLevelIndicator}`;
    }).join('\n');
    
    return `*${title}*\n${troopsList}\n\n`;
  };
  
  // Build the message with all sections
  const elixirTroopsSection = formatSection(elixirTroops, 'Elixir Troops');
  const darkElixirTroopsSection = formatSection(darkElixirTroops, 'Dark Elixir Troops');
  const heroPetsSection = formatSection(heroPets, 'Hero Pets');
  const siegeMachinesSection = formatSection(siegeMachines, 'Siege Machines');
  
  return `
*Troops for ${escapeMarkdown(player.name)}*

${elixirTroopsSection}${darkElixirTroopsSection}${heroPetsSection}${siegeMachinesSection}`.trim();
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
  
  // Map hero names to emojis
  const heroEmojis: {[key: string]: string} = {
    'Barbarian King': '👑',
    'Archer Queen': '🏹',
    'Grand Warden': '📚',
    'Royal Champion': '🛡️',
    'Minion Prince': '🦇',
  };
  
  const heroesList = sortedHeroes.map(hero => {
    const maxLevelIndicator = hero.level === hero.maxLevel ? ' ✅' : '';
    const emoji = heroEmojis[hero.name] || '⚔️'; // Default emoji if hero name not found
    return `${emoji} ${escapeMarkdown(hero.name)}: ${hero.level}/${hero.maxLevel}${maxLevelIndicator}`;
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
  
  // Separate elixir and dark spells
  const elixirSpells = homeVillageSpells.filter(spell => 
    ['Lightning Spell', 'Healing Spell', 'Rage Spell', 'Jump Spell', 
    'Freeze Spell', 'Clone Spell', 'Invisibility Spell', 
    'Recall Spell', 'Revive Spell'].includes(spell.name)
  );
  
  const darkSpells = homeVillageSpells.filter(spell => 
    ['Poison Spell', 'Earthquake Spell', 'Haste Spell', 'Skeleton Spell', 
    'Bat Spell', 'Overgrowth Spell', 'Ice Block Spell'].includes(spell.name)
  );
  
  // Map spell names to emojis
  const spellEmojis: {[key: string]: string} = {
    'Lightning Spell': '⚡',
    'Healing Spell': '❤️',
    'Rage Spell': '😡',
    'Jump Spell': '🦘',
    'Freeze Spell': '❄️',
    'Clone Spell': '👥',
    'Invisibility Spell': '👻',
    'Recall Spell': '↩️',
    'Revive Spell': '💫',
    'Poison Spell': '☠️',
    'Earthquake Spell': '🌋',
    'Haste Spell': '💨',
    'Skeleton Spell': '💀',
    'Bat Spell': '🦇',
    'Overgrowth Spell': '🌿',
    'Ice Block Spell': '🧊'
  };
  
  // Format each section
  const formatSpellsWithEmoji = (spells: any[]) => {
    if (spells.length === 0) return '';
    const sortedSpells = [...spells].sort((a, b) => a.name.localeCompare(b.name));
    return sortedSpells.map(spell => {
      const maxLevelIndicator = spell.level === spell.maxLevel ? ' ✅' : '';
      const emoji = spellEmojis[spell.name] || '🧪'; // Default emoji
      return `${emoji} ${escapeMarkdown(spell.name)}: ${spell.level}/${spell.maxLevel}${maxLevelIndicator}`;
    }).join('\n');
  };
  
  const elixirSpellsList = formatSpellsWithEmoji(elixirSpells);
  const darkSpellsList = formatSpellsWithEmoji(darkSpells);
  
  return `
*Spells for ${escapeMarkdown(player.name)}*

*Elixir Spells:*
${elixirSpellsList || 'No elixir spells available'}

*Dark Spells:*
${darkSpellsList || 'No dark spells available'}
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

/**
 * Format player elixir troops for display in Telegram
 */
export function formatPlayerElixirTroops(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No elixir troop data available';
  }

  // Filter home village troops (exclude super troops)
  const homeVillageTroops = player.troops.filter(troop => 
    troop.village === 'home' && !troop.name.startsWith('Super')
  );
  
  // Filter elixir troops
  const elixirTroops = homeVillageTroops.filter(troop => 
    ['Barbarian', 'Archer', 'Giant', 'Goblin', 'Wall Breaker', 
    'Balloon', 'Wizard', 'Healer', 'Dragon', 'P.E.K.K.A', 'Baby Dragon', 
    'Miner', 'Electro Dragon', 'Yeti', 'Dragon Rider', 'Electro Titan',
    'Root Rider', 'Thrower'].includes(troop.name)
  );
  
  if (elixirTroops.length === 0) {
    return 'No elixir troop data available';
  }
  
  // Map troop names to emojis
  const troopEmojis: {[key: string]: string} = {
    'Barbarian': '⚔️',
    'Archer': '🏹',
    'Giant': '💪',
    'Goblin': '💰',
    'Wall Breaker': '💣',
    'Balloon': '🎈',
    'Wizard': '🧙',
    'Healer': '💗',
    'Dragon': '🐉',
    'P.E.K.K.A': '🤖',
    'Baby Dragon': '🐲',
    'Miner': '⛏️',
    'Electro Dragon': '⚡',
    'Yeti': '❄️',
    'Dragon Rider': '🐉',
    'Electro Titan': '⚡',
    'Root Rider': '🌱',
    'Thrower': '🔥'
  };
  
  // Sort troops by name
  const sortedTroops = [...elixirTroops].sort((a, b) => a.name.localeCompare(b.name));
  
  const troopsList = sortedTroops.map(troop => {
    const maxLevelIndicator = troop.level === troop.maxLevel ? ' ✅' : '';
    const emoji = troopEmojis[troop.name] || '🪖'; // Default emoji
    return `${emoji} ${escapeMarkdown(troop.name)}: ${troop.level}/${troop.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Elixir Troops for ${escapeMarkdown(player.name)}*

${troopsList}
`.trim();
}

/**
 * Format player dark elixir troops for display in Telegram
 */
export function formatPlayerDarkTroops(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No dark elixir troop data available';
  }

  // Filter home village troops (exclude super troops)
  const homeVillageTroops = player.troops.filter(troop => 
    troop.village === 'home' && !troop.name.startsWith('Super')
  );
  
  // Filter dark elixir troops
  const darkElixirTroops = homeVillageTroops.filter(troop => 
    ['Minion', 'Hog Rider', 'Valkyrie', 'Golem', 'Witch', 'Lava Hound', 
    'Bowler', 'Ice Golem', 'Headhunter', 'Apprentice Warden', 'Druid', 
    'Furnace'].includes(troop.name)
  );
  
  if (darkElixirTroops.length === 0) {
    return 'No dark elixir troop data available';
  }
  
  // Map troop names to emojis
  const darkTroopEmojis: {[key: string]: string} = {
    'Minion': '🦇',
    'Hog Rider': '🐗',
    'Valkyrie': '🔴',
    'Golem': '🪨',
    'Witch': '🧙‍♀️',
    'Lava Hound': '🌋',
    'Bowler': '🎳',
    'Ice Golem': '☃️',
    'Headhunter': '🏹',
    'Apprentice Warden': '📚',
    'Druid': '🌿',
    'Furnace': '🔥'
  };
  
  // Sort troops by name
  const sortedTroops = [...darkElixirTroops].sort((a, b) => a.name.localeCompare(b.name));
  
  const troopsList = sortedTroops.map(troop => {
    const maxLevelIndicator = troop.level === troop.maxLevel ? ' ✅' : '';
    const emoji = darkTroopEmojis[troop.name] || '🖤'; // Default emoji
    return `${emoji} ${escapeMarkdown(troop.name)}: ${troop.level}/${troop.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Dark Elixir Troops for ${escapeMarkdown(player.name)}*

${troopsList}
`.trim();
}

/**
 * Format player hero pets for display in Telegram
 */
export function formatPlayerHeroPets(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No hero pet data available';
  }

  // Filter home village troops
  const homeVillageTroops = player.troops.filter(troop => 
    troop.village === 'home'
  );
  
  // Filter hero pets
  const heroPets = homeVillageTroops.filter(troop => 
    ['L.A.S.S.I', 'Electro Owl', 'Mighty Yak', 'Unicorn', 
    'Frosty', 'Diggy', 'Poison Lizard', 'Phoenix', 
    'Spirit Fox', 'Angry Jelly', 'Sneezy'].includes(troop.name)
  );
  
  if (heroPets.length === 0) {
    return 'No hero pet data available';
  }
  
  // Map pet names to emojis
  const petEmojis: {[key: string]: string} = {
    'L.A.S.S.I': '🐕',
    'Electro Owl': '🦉',
    'Mighty Yak': '🐃',
    'Unicorn': '🦄',
    'Frosty': '❄️',
    'Diggy': '🦔',
    'Poison Lizard': '🦎',
    'Phoenix': '🔥',
    'Spirit Fox': '🦊',
    'Angry Jelly': '🫠',
    'Sneezy': '🤧'
  };
  
  // Sort pets by name
  const sortedPets = [...heroPets].sort((a, b) => a.name.localeCompare(b.name));
  
  const petsList = sortedPets.map(pet => {
    const maxLevelIndicator = pet.level === pet.maxLevel ? ' ✅' : '';
    const emoji = petEmojis[pet.name] || '🐾'; // Default emoji
    return `${emoji} ${escapeMarkdown(pet.name)}: ${pet.level}/${pet.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Hero Pets for ${escapeMarkdown(player.name)}*

${petsList}
`.trim();
}

/**
 * Format player siege machines for display in Telegram
 */
export function formatPlayerSiegeMachines(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No siege machine data available';
  }

  // Filter home village troops
  const homeVillageTroops = player.troops.filter(troop => 
    troop.village === 'home'
  );
  
  // Filter siege machines
  const siegeMachines = homeVillageTroops.filter(troop => 
    ['Wall Wrecker', 'Battle Blimp', 'Stone Slammer', 'Siege Barracks',
    'Log Launcher', 'Flame Flinger', 'Battle Drill', 'Troop Launcher'].includes(troop.name)
  );
  
  if (siegeMachines.length === 0) {
    return 'No siege machine data available';
  }
  
  // Map siege machine names to emojis
  const siegeEmojis: {[key: string]: string} = {
    'Wall Wrecker': '🚚',
    'Battle Blimp': '🎈',
    'Stone Slammer': '🪨',
    'Siege Barracks': '🏛️',
    'Log Launcher': '🪵',
    'Flame Flinger': '🔥',
    'Battle Drill': '⚙️',
    'Troop Launcher': '🚀'
  };
  
  // Sort siege machines by name
  const sortedMachines = [...siegeMachines].sort((a, b) => a.name.localeCompare(b.name));
  
  const machinesList = sortedMachines.map(machine => {
    const maxLevelIndicator = machine.level === machine.maxLevel ? ' ✅' : '';
    const emoji = siegeEmojis[machine.name] || '🛠️'; // Default emoji
    return `${emoji} ${escapeMarkdown(machine.name)}: ${machine.level}/${machine.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Siege Machines for ${escapeMarkdown(player.name)}*

${machinesList}
`.trim();
}

/**
 * Create inline keyboard for spell types
 */
export function createSpellTypesKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("🔮 Elixir Spells", `elixir_spells_${playerTag}`)
    .text("🧿 Dark Spells", `dark_spells_${playerTag}`)
    .row()
    .text("🧪 All Spells", `all_spells_${playerTag}`)
    .text("« Back", `back_to_player_${playerTag}`);
}

/**
 * Format player elixir spells for display in Telegram
 */
export function formatPlayerElixirSpells(player: Player): string {
  if (!player.spells || player.spells.length === 0) {
    return 'No elixir spell data available';
  }

  // Filter home village elixir spells
  const elixirSpells = player.spells.filter(spell => 
    spell.village === 'home' && 
    ['Lightning Spell', 'Healing Spell', 'Rage Spell', 'Jump Spell', 
    'Freeze Spell', 'Clone Spell', 'Invisibility Spell', 
    'Recall Spell', 'Revive Spell'].includes(spell.name)
  );
  
  if (elixirSpells.length === 0) {
    return 'No elixir spell data available';
  }
  
  // Map spell names to emojis
  const spellEmojis: {[key: string]: string} = {
    'Lightning Spell': '⚡',
    'Healing Spell': '❤️',
    'Rage Spell': '😡',
    'Jump Spell': '🦘',
    'Freeze Spell': '❄️',
    'Clone Spell': '👥',
    'Invisibility Spell': '👻',
    'Recall Spell': '↩️',
    'Revive Spell': '💫'
  };
  
  // Sort spells by name
  const sortedSpells = [...elixirSpells].sort((a, b) => a.name.localeCompare(b.name));
  
  const spellsList = sortedSpells.map(spell => {
    const maxLevelIndicator = spell.level === spell.maxLevel ? ' ✅' : '';
    const emoji = spellEmojis[spell.name] || '🧪'; // Default emoji
    return `${emoji} ${escapeMarkdown(spell.name)}: ${spell.level}/${spell.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Elixir Spells for ${escapeMarkdown(player.name)}*

${spellsList}
`.trim();
}

/**
 * Format player dark spells for display in Telegram
 */
export function formatPlayerDarkSpells(player: Player): string {
  if (!player.spells || player.spells.length === 0) {
    return 'No dark spell data available';
  }

  // Filter home village dark spells
  const darkSpells = player.spells.filter(spell => 
    spell.village === 'home' && 
    ['Poison Spell', 'Earthquake Spell', 'Haste Spell', 'Skeleton Spell', 
    'Bat Spell', 'Overgrowth Spell', 'Ice Block Spell'].includes(spell.name)
  );
  
  if (darkSpells.length === 0) {
    return 'No dark spell data available';
  }
  
  // Map spell names to emojis
  const darkSpellEmojis: {[key: string]: string} = {
    'Poison Spell': '☠️',
    'Earthquake Spell': '🌋',
    'Haste Spell': '💨',
    'Skeleton Spell': '💀',
    'Bat Spell': '🦇',
    'Overgrowth Spell': '🌿',
    'Ice Block Spell': '🧊'
  };
  
  // Sort spells by name
  const sortedSpells = [...darkSpells].sort((a, b) => a.name.localeCompare(b.name));
  
  const spellsList = sortedSpells.map(spell => {
    const maxLevelIndicator = spell.level === spell.maxLevel ? ' ✅' : '';
    const emoji = darkSpellEmojis[spell.name] || '⚗️'; // Default emoji
    return `${emoji} ${escapeMarkdown(spell.name)}: ${spell.level}/${spell.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Dark Spells for ${escapeMarkdown(player.name)}*

${spellsList}
`.trim();
}

/**
 * Create inline keyboard for builder base options
 */
export function createBuilderBaseKeyboard(playerTag: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("🪖 Builder Troops", `builder_troops_${playerTag}`)
    .text("🤖 Builder Heroes", `builder_heroes_${playerTag}`)
    .row()
    .text("« Back to Player", `back_to_player_${playerTag}`);
}

/**
 * Format player builder base troops
 */
export function formatPlayerBuilderTroops(player: Player): string {
  if (!player.troops || player.troops.length === 0) {
    return 'No builder base troop data available';
  }

  // Filter builder base troops
  const builderTroops = player.troops.filter(troop => troop.village === 'builderBase');
  
  if (builderTroops.length === 0) {
    return 'No builder base troop data available';
  }
  
  // Map troop names to emojis
  const troopEmojis: {[key: string]: string} = {
    'Raged Barbarian': '⚔️',
    'Sneaky Archer': '🏹',
    'Boxer Giant': '💪',
    'Beta Minion': '🦇',
    'Bomber': '💣',
    'Baby Dragon': '🐲',
    'Cannon Cart': '🛒',
    'Night Witch': '🧙‍♀️',
    'Drop Ship': '🚢',
    'Super P.E.K.K.A': '🤖',
    'Hog Glider': '🐗',
    'Electrofire Wizard': '⚡',
    'Mighty Yak': '🐃',
    'Flame Flinger': '🔥',
    'Rocket Balloon': '🚀',
    'Power P.E.K.K.A': '💥'
  };
  
  // Sort troops by name
  const sortedTroops = [...builderTroops].sort((a, b) => a.name.localeCompare(b.name));
  
  const troopsList = sortedTroops.map(troop => {
    const maxLevelIndicator = troop.level === troop.maxLevel ? ' ✅' : '';
    const emoji = troopEmojis[troop.name] || '🪖'; // Default emoji
    return `${emoji} ${escapeMarkdown(troop.name)}: ${troop.level}/${troop.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Builder Base Troops for ${escapeMarkdown(player.name)}*

${troopsList}
`.trim();
}

/**
 * Format player builder base heroes
 */
export function formatPlayerBuilderHeroes(player: Player): string {
  if (!player.heroes || player.heroes.length === 0) {
    return 'No builder base hero data available';
  }

  // Filter builder base heroes
  const builderHeroes = player.heroes.filter(hero => hero.village === 'builderBase');
  
  if (builderHeroes.length === 0) {
    return 'No builder base hero data available';
  }
  
  // Map hero names to emojis
  const heroEmojis: {[key: string]: string} = {
    'Battle Machine': '🤖',
    'Battle Copter': '🚁'
  };
  
  // Sort heroes by name
  const sortedHeroes = [...builderHeroes].sort((a, b) => a.name.localeCompare(b.name));
  
  const heroesList = sortedHeroes.map(hero => {
    const maxLevelIndicator = hero.level === hero.maxLevel ? ' ✅' : '';
    const emoji = heroEmojis[hero.name] || '👑'; // Default emoji
    return `${emoji} ${escapeMarkdown(hero.name)}: ${hero.level}/${hero.maxLevel}${maxLevelIndicator}`;
  }).join('\n');
  
  return `
*Builder Base Heroes for ${escapeMarkdown(player.name)}*

${heroesList}
`.trim();
}

/**
 * Format comprehensive builder base details
 */
export function formatPlayerBuilderBaseDetails(player: Player): string {
  if (!player.builderHallLevel) {
    return 'No Builder Base data available for this player.';
  }
  
  // Builder Base stats section with better formatting
  let statsSection = '*🏗️ Builder Base Stats*\n';
  statsSection += `🏠 *Builder Hall:* ${player.builderHallLevel}\n`;
  
  // Use builderBaseTrophies first, fall back to versusTrophies for backward compatibility
  const trophies = player.builderBaseTrophies !== undefined ? player.builderBaseTrophies : player.versusTrophies;
  if (typeof trophies === 'number') {
    statsSection += `🏆 *Versus Trophies:* ${trophies}`;
    
    // Add Builder Base League if available
    if (player.builderBaseLeague) {
      let leagueName = '';
      
      if (typeof player.builderBaseLeague.name === 'string') {
        leagueName = player.builderBaseLeague.name;
      } else if (player.builderBaseLeague.name) {
        // Try to get English name first
        if (player.builderBaseLeague.name.en) {
          leagueName = player.builderBaseLeague.name.en;
        } else {
          // Get first available language
          const keys = Object.keys(player.builderBaseLeague.name);
          if (keys.length > 0) {
            leagueName = player.builderBaseLeague.name[keys[0]];
          }
        }
      }
      
      if (leagueName) {
        // Escape the pipe character for MarkdownV2
        statsSection += ` \\| ${escapeMarkdown(leagueName)}`;
      }
    }
    statsSection += '\n';
  }
  
  // Use bestBuilderBaseTrophies first, fall back to bestVersusTrophies for backward compatibility
  const bestTrophies = player.bestBuilderBaseTrophies !== undefined ? player.bestBuilderBaseTrophies : player.bestVersusTrophies;
  if (typeof bestTrophies === 'number') {
    statsSection += `🏅 *Best Versus Trophies:* ${bestTrophies}\n`;
  }
  
  if (typeof player.versusBattleWins === 'number') {
    statsSection += `⚔️ *Versus Battle Wins:* ${player.versusBattleWins}\n`;
  }
  
  // Count Builder Base troops and heroes
  let troopCount = 0;
  let maxedTroopCount = 0;
  let heroCount = 0;
  let maxedHeroCount = 0;
  
  if (player.troops) {
    const builderTroops = player.troops.filter(troop => troop.village === 'builderBase');
    troopCount = builderTroops.length;
    maxedTroopCount = builderTroops.filter(troop => troop.level === troop.maxLevel).length;
  }
  
  if (player.heroes) {
    const builderHeroes = player.heroes.filter(hero => hero.village === 'builderBase');
    heroCount = builderHeroes.length;
    maxedHeroCount = builderHeroes.filter(hero => hero.level === hero.maxLevel).length;
  }
  
  // Add troop and hero counts with better formatting and visual progress
  let unitsSection = '\n*🛡️ Builder Base Army*\n';
  
  // Create visual progress bar for maxed troops
  const troopProgressPercentage = troopCount > 0 ? Math.floor((maxedTroopCount / troopCount) * 100) : 0;
  const troopFilledBlocks = Math.floor(troopProgressPercentage / 10);
  const troopEmptyBlocks = 10 - troopFilledBlocks;
  const troopProgressBar = `[${'█'.repeat(troopFilledBlocks)}${'░'.repeat(troopEmptyBlocks)}] ${troopProgressPercentage}%`;
  
  // Create visual progress bar for maxed heroes
  const heroProgressPercentage = heroCount > 0 ? Math.floor((maxedHeroCount / heroCount) * 100) : 0;
  const heroFilledBlocks = Math.floor(heroProgressPercentage / 10);
  const heroEmptyBlocks = 10 - heroFilledBlocks;
  const heroProgressBar = `[${'█'.repeat(heroFilledBlocks)}${'░'.repeat(heroEmptyBlocks)}] ${heroProgressPercentage}%`;
  
  unitsSection += `🪖 *Troops:* ${troopCount} \\(${maxedTroopCount} maxed\\) ${troopProgressBar}\n`;
  unitsSection += `👑 *Heroes:* ${heroCount} \\(${maxedHeroCount} maxed\\) ${heroProgressBar}\n`;
  
  return `
*📊 Builder Base for ${escapeMarkdown(player.name)}* \\(${escapeMarkdown(player.tag)}\\)

${statsSection}${unitsSection}
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
  createTroopTypesKeyboard,
  formatPlayerElixirTroops,
  formatPlayerDarkTroops,
  formatPlayerHeroPets,
  formatPlayerSiegeMachines,
  createSpellTypesKeyboard,
  formatPlayerElixirSpells,
  formatPlayerDarkSpells,
  createBuilderBaseKeyboard,
  formatPlayerBuilderTroops,
  formatPlayerBuilderHeroes,
  formatGoldPassStatus,
  formatPlayerBuilderBaseDetails,
}; 