import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import cocApi from '../services/cocApi.js';
import playerUtils from '../utils/formatPlayer.js';
import clanUtils from '../utils/formatClan.js';
import { handleApiError } from '../utils/errors.js';
import userService from '../services/userService.js';

const composer = new Composer<MyContext>();

// Command to save player tag
composer.command('setplayer', async (ctx) => {
  if (!ctx.from) {
    return ctx.reply('Error: Could not identify user.');
  }

  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /setplayer <player_tag>\nExample: /setplayer #2PGGJ20V');
  }
  
  let playerTag = args[0];
  
  // Add # if missing
  if (!playerTag.startsWith('#')) {
    playerTag = '#' + playerTag;
  }

  try {
    // Verify the tag exists by making an API call
    await cocApi.getPlayer(playerTag);
    
    // Save to database
    await userService.savePlayerTag(ctx.from.id, playerTag);
    
    await ctx.reply(`Your player tag has been saved as ${playerTag}.\nUse /info to quickly access your profile.`);
  } catch (error) {
    await handleApiError(ctx, error, 'player');
  }
});

// Command to save clan tag
composer.command('setclan', async (ctx) => {
  if (!ctx.from) {
    return ctx.reply('Error: Could not identify user.');
  }

  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /setclan <clan_tag>\nExample: /setclan #2PGGJ20V');
  }
  
  let clanTag = args[0];
  
  // Add # if missing
  if (!clanTag.startsWith('#')) {
    clanTag = '#' + clanTag;
  }

  try {
    // Verify the tag exists by making an API call
    await cocApi.getClan(clanTag);
    
    // Save to database
    await userService.saveClanTag(ctx.from.id, clanTag);
    
    await ctx.reply(`Your clan tag has been saved as ${clanTag}.\nUse /infoclan to quickly access your clan.`);
  } catch (error) {
    await handleApiError(ctx, error, 'clan');
  }
});

// Command to show saved player info
composer.command('info', async (ctx) => {
  if (!ctx.from) {
    return ctx.reply('Error: Could not identify user.');
  }
  
  const playerTag = ctx.user?.playerTag;
  
  if (!playerTag) {
    return ctx.reply('You haven\'t saved your player tag yet. Use /setplayer <tag> to save your tag.');
  }
  
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.reply(playerUtils.formatPlayerInfo(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createPlayerKeyboard(playerTag)
    });
  } catch (error) {
    await handleApiError(ctx, error, 'player');
  }
});

// Command to show saved clan info
composer.command('infoclan', async (ctx) => {
  if (!ctx.from) {
    return ctx.reply('Error: Could not identify user.');
  }
  
  const clanTag = ctx.user?.clanTag;
  
  if (!clanTag) {
    return ctx.reply('You haven\'t saved your clan tag yet. Use /setclan <tag> to save your clan tag.');
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

export default composer; 