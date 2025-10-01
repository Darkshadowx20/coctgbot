import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import cocApi from '../services/cocApi.js';
import clanUtils from '../utils/formatClan.js';

const composer = new Composer<MyContext>();

/**
 * Callback queries for clan details
 */
composer.callbackQuery(/^members_(.+)$/, async (ctx) => {
  // Parse clan tag and page number from callback data
  const match = ctx.match[1].match(/^(.+?)(?:_(\d+))?$/);
  if (!match) return;
  
  const clanTag = match[1];
  const page = match[2] ? parseInt(match[2]) : 1;
  
  try {
    const members = await cocApi.getClanMembers(clanTag);
    
    await ctx.editMessageText(clanUtils.formatClanMembers(members, page), {
      parse_mode: 'Markdown',
      reply_markup: clanUtils.createClanMembersKeyboard(clanTag, page, members.items ? members.items.length : 0)
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

// Handle page info button click (do nothing)
composer.callbackQuery('members_page_info', async (ctx) => {
  await ctx.answerCallbackQuery();
});

composer.callbackQuery(/^donators_(.+)$/, async (ctx) => {
  // Parse clan tag and page number from callback data
  const match = ctx.match[1].match(/^(.+?)(?:_(\d+))?$/);
  if (!match) return;
  
  const clanTag = match[1];
  const page = match[2] ? parseInt(match[2]) : 1;
  
  try {
    const members = await cocApi.getClanMembers(clanTag);
    
    await ctx.editMessageText(clanUtils.formatTopDonators(members, page), {
      parse_mode: 'Markdown',
      reply_markup: clanUtils.createTopDonatorsKeyboard(clanTag, page, members.items ? members.items.length : 0)
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

// Handle donators page info button click (do nothing)
composer.callbackQuery('donators_page_info', async (ctx) => {
  await ctx.answerCallbackQuery();
});

// Handle war log page info button click (do nothing)
composer.callbackQuery('warlog_page_info', async (ctx) => {
  await ctx.answerCallbackQuery();
});

composer.callbackQuery(/^warlog_(.+)$/, async (ctx) => {
  // Parse clan tag and page number from callback data
  const match = ctx.match[1].match(/^(.+?)(?:_(\d+))?$/);
  if (!match) return;
  
  const clanTag = match[1];
  const page = match[2] ? parseInt(match[2]) : 1;
  
  try {
    const warLog = await cocApi.getClanWarLog(clanTag);
    const clan = await cocApi.getClan(clanTag);
    const clanName = clan.name;
    
    await ctx.editMessageText(clanUtils.formatClanWarLog(warLog, clanName, page), {
      parse_mode: 'Markdown',
      reply_markup: clanUtils.createWarLogKeyboard(clanTag, page, warLog.items ? warLog.items.length : 0)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error fetching clan war log:', error);
    
    // Check if it's an access denied error
    const isAccessDenied = error instanceof Error && 
      (error.message.includes('accessDenied') || error.message.includes('access denied'));
    
    if (isAccessDenied) {
      // Get clan name for better message
      try {
        const clan = await cocApi.getClan(clanTag);
        const clanName = clan.name;
        
        await ctx.editMessageText(`*War Log for ${clanUtils.escapeMarkdown(clanName)}*\n\n⚠️ This clan has set their war log to private\\.\n\nThe clan leader needs to make the war log public in game settings to view this information\\. Path: Clan Settings → War Log → Public`, {
          parse_mode: 'Markdown',
          reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
        });
      } catch {
        await ctx.editMessageText(`*War Log*\n\n⚠️ This clan has set their war log to private\\.\n\nThe clan leader needs to make the war log public in game settings to view this information\\. Path: Clan Settings → War Log → Public`, {
          parse_mode: 'Markdown',
          reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
        });
      }
    } else {
      // Generic error
      await ctx.editMessageText(`*Error*\n\nFailed to fetch war log\\. Please try again later\\.`, {
        parse_mode: 'Markdown',
        reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
      });
    }
    
    await ctx.answerCallbackQuery({
      text: isAccessDenied ? 'This clan has set their war log to private' : 'Error fetching clan war log',
      show_alert: true
    });
  }
});

composer.callbackQuery(/^currentwar_(.+)$/, async (ctx) => {
  const clanTag = ctx.match[1];
  
  try {
    const currentWar = await cocApi.getCurrentWar(clanTag);
    
    await ctx.editMessageText(clanUtils.formatCurrentWar(currentWar), {
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
      reply_markup: clanUtils.createBackToClanKeyboard(clanTag)
    });
  } catch (error) {
    const errorMessage = error instanceof Error && error.message === 'notFound'
      ? '*War League Status*\n\nThis clan is not currently participating in a Clan War League\\.'
      : '*Error*\n\nFailed to fetch war league information\\.';
    await ctx.editMessageText(errorMessage, {
      parse_mode: 'Markdown',
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
        parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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