import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import cocApi from '../services/cocApi.js';
import clanUtils from '../utils/formatClan.js';
import { handleApiError } from '../utils/errors.js';

const composer = new Composer<MyContext>();

/**
 * Command to get clan information
 * Usage: /clan <clan_tag>
 */
composer.command('clan', async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /clan <clan_tag>\nExample: /clan #2PGGJ20V');
  }
  
  let clanTag = args[0];
  
  // Add # if missing
  if (!clanTag.startsWith('#')) {
    clanTag = '#' + clanTag;
  }

  try {
    const clan = await cocApi.getClan(clanTag);
    
    await ctx.reply(clanUtils.formatClanInfo(clan), {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createClanKeyboard(clanTag)
    });
  } catch (error) {
    await handleApiError(ctx, error, 'clan');
  }
});

/**
 * Command to search for clans
 * Usage: /clansearch <name> [min_members] [max_members] [min_level]
 */
composer.command('clansearch', async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /clansearch <name> [min_members] [max_members] [min_level]\nExample: /clansearch Clash 20 50 10');
  }
  
  const name = args[0];
  const minMembers = args.length > 1 ? parseInt(args[1]) : undefined;
  const maxMembers = args.length > 2 ? parseInt(args[2]) : undefined;
  const minClanLevel = args.length > 3 ? parseInt(args[3]) : undefined;
  
  try {
    const searchResults = await cocApi.searchClans({
      name,
      minMembers,
      maxMembers,
      minClanLevel,
      limit: 10
    });
    
    await ctx.reply(clanUtils.formatClanSearchResults(searchResults), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'clan search');
  }
});

/**
 * Command to get clan members
 * Usage: /clanmembers <clan_tag>
 */
composer.command(['clanmembers', 'members'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /clanmembers <clan_tag>\nExample: /clanmembers #2PGGJ20V');
  }
  
  let clanTag = args[0];
  
  // Add # if missing
  if (!clanTag.startsWith('#')) {
    clanTag = '#' + clanTag;
  }
  
  try {
    const members = await cocApi.getClanMembers(clanTag);
    
    await ctx.reply(clanUtils.formatClanMembers(members), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'clan members');
  }
});

/**
 * Command to get clan war log
 * Usage: /clanwarlog <clan_tag>
 */
composer.command(['clanwarlog', 'warlog'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /clanwarlog <clan_tag>\nExample: /clanwarlog #2PGGJ20V');
  }
  
  let clanTag = args[0];
    
  // Add # if missing
  if (!clanTag.startsWith('#')) {
    clanTag = '#' + clanTag;
  }
  
  try {
    const warLog = await cocApi.getClanWarLog(clanTag);
    
    await ctx.reply(clanUtils.formatClanWarLog(warLog, clanTag), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'clan war log');
  }
});

/**
 * Command to get current clan war
 * Usage: /currentwar <clan_tag>
 */
composer.command(['currentwar', 'war'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /currentwar <clan_tag>\nExample: /currentwar #2PGGJ20V');
    }
    
  let clanTag = args[0];
    
  // Add # if missing
  if (!clanTag.startsWith('#')) {
    clanTag = '#' + clanTag;
  }
  
  try {
    const currentWar = await cocApi.getCurrentWar(clanTag);
    
    await ctx.reply(clanUtils.formatCurrentWar(currentWar), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'current war');
  }
});

/**
 * Command to get clan capital raid seasons
 * Usage: /capitalraids <clan_tag>
 */
composer.command(['capitalraids', 'raids'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /capitalraids <clan_tag>\nExample: /capitalraids #2PGGJ20V');
  }
  
  let clanTag = args[0];
  
  // Add # if missing
  if (!clanTag.startsWith('#')) {
    clanTag = '#' + clanTag;
  }
  
  try {
    const raidSeasons = await cocApi.getClanCapitalRaidSeasons(clanTag);
    
    if (raidSeasons.items && raidSeasons.items.length > 0) {
      const latestSeason = raidSeasons.items[0];
      await ctx.reply(clanUtils.formatCapitalRaidSeason(latestSeason, clanTag), {
        parse_mode: 'MarkdownV2'
      });
    } else {
      await ctx.reply('No raid seasons found for this clan');
    }
  } catch (error) {
    await handleApiError(ctx, error, 'capital raid seasons');
  }
});

/**
 * Command to get clan war league group
 * Usage: /clanwarleague <clan_tag>
 */
composer.command(['clanwarleague', 'cwl'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /clanwarleague <clan_tag>\nExample: /clanwarleague #2PGGJ20V');
  }
  
  let clanTag = args[0];
    
  // Add # if missing
  if (!clanTag.startsWith('#')) {
    clanTag = '#' + clanTag;
  }
  
  try {
    const cwlGroup = await cocApi.getCurrentWarLeagueGroup(clanTag);
    
    await ctx.reply(clanUtils.formatClanWarLeagueGroup(cwlGroup), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'clan war league group');
    }
});

/**
 * Command to get top clans
 * Usage: /topclans [country_code]
 */
composer.command(['topclans'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  let locationId = 0; // Global by default
  
  if (args && args.length > 0 && args[0]) {
    // Try to get location by country code
    try {
      const locations = await cocApi.getLocations();
      const location = locations.items.find((loc: any) => 
        loc.countryCode && loc.countryCode.toLowerCase() === args[0].toLowerCase()
      );
      
      if (location) {
        locationId = location.id;
      } else {
        return ctx.reply(`Could not find location with country code: ${args[0]}\nUsing global rankings instead.`);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Continue with global rankings
    }
  }
  
  try {
    const rankings = await cocApi.getClanRankings(locationId);
    
    await ctx.reply(clanUtils.formatClanRankings(rankings), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'clan rankings');
  }
});

/**
 * Command to get top builder base clans
 * Usage: /topbuilderclans [country_code]
 */
composer.command(['topbuilderclans', 'topbbclans'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  let locationId = 0; // Global by default
  
  if (args && args.length > 0 && args[0]) {
    // Try to get location by country code
    try {
      const locations = await cocApi.getLocations();
      const location = locations.items.find((loc: any) => 
        loc.countryCode && loc.countryCode.toLowerCase() === args[0].toLowerCase()
      );
      
      if (location) {
        locationId = location.id;
      } else {
        return ctx.reply(`Could not find location with country code: ${args[0]}\nUsing global rankings instead.`);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Continue with global rankings
    }
  }
  
  try {
    const rankings = await cocApi.getClanVersusRankings(locationId);
    
    await ctx.reply(clanUtils.formatClanVersusRankings(rankings), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'builder base clan rankings');
    }
});

/**
 * Callback queries for clan details
 */
composer.callbackQuery(/^members_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  
  try {
    const members = await cocApi.getClanMembers(clanTag);
    
    await ctx.editMessageText(clanUtils.formatClanMembers(members), {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error fetching clan members:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching clan members',
      show_alert: true
    });
  }
});

composer.callbackQuery(/^donators_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  
  try {
    const members = await cocApi.getClanMembers(clanTag);
    
    await ctx.editMessageText(clanUtils.formatTopDonators(members), {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error fetching clan donators:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching clan donators',
      show_alert: true
    });
  }
});

composer.callbackQuery(/^warlog_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  
  try {
    const warLog = await cocApi.getClanWarLog(clanTag);
    
    await ctx.editMessageText(clanUtils.formatClanWarLog(warLog, clanTag), {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error fetching clan war log:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching clan war log',
      show_alert: true
    });
  }
});

composer.callbackQuery(/^currentwar_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  
  try {
    const currentWar = await cocApi.getCurrentWar(clanTag);
    
    await ctx.editMessageText(clanUtils.formatCurrentWar(currentWar), {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error fetching current war:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching current war',
      show_alert: true
    });
  }
});

composer.callbackQuery(/^warleague_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  try {
    const leagueGroup = await cocApi.getCurrentWarLeagueGroup(clanTag);
    const message = clanUtils.formatClanWarLeagueGroup(leagueGroup);
    await ctx.editMessageText(message, {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
    });
  } catch (error) {
    const errorMessage = error instanceof Error && error.message === 'notFound'
      ? '*War League Status*\n\nThis clan is not currently participating in a Clan War League\\.'
      : '*Error*\n\nFailed to fetch war league information\\.';
    await ctx.editMessageText(errorMessage, {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
    });
  }
});

composer.callbackQuery(/^capitalraids_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  
  try {
    const raidSeasons = await cocApi.getClanCapitalRaidSeasons(clanTag);
    
    if (raidSeasons.items && raidSeasons.items.length > 0) {
      const latestSeason = raidSeasons.items[0];
      await ctx.editMessageText(clanUtils.formatCapitalRaidSeason(latestSeason, clanTag), {
        parse_mode: 'MarkdownV2',
        reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
      });
    } else {
      await ctx.editMessageText('No raid seasons found for this clan', {
        reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
      });
    }
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error fetching capital raid seasons:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching capital raid seasons',
      show_alert: true
    });
  }
});

composer.callbackQuery(/^back_to_clan_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  
  try {
    const clan = await cocApi.getClan(clanTag);
    
    await ctx.editMessageText(clanUtils.formatClanInfo(clan), {
      parse_mode: 'MarkdownV2',
      reply_markup: clanUtils.createClanKeyboard(clanTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error handling back button:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching clan info',
      show_alert: true
    });
  }
});

export default composer; 