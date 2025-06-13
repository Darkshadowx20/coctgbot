import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import cocApi from '../services/cocApi.js';
import playerUtils from '../utils/formatPlayer.js';

const composer = new Composer<MyContext>();

/**
 * Callback queries for player details
 */
composer.callbackQuery(/^troops_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerTroops(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player troops');
    console.error('Error fetching player troops:', error);
  }
});

composer.callbackQuery(/^heroes_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
  
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerHeroes(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player heroes');
    console.error('Error fetching player heroes:', error);
  }
});

composer.callbackQuery(/^spells_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerSpells(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player spells');
    console.error('Error fetching player spells:', error);
  }
});

composer.callbackQuery(/^achievements_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerAchievements(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player achievements');
    console.error('Error fetching player achievements:', error);
  }
});

composer.callbackQuery(/^back_to_player_(.+)$/, async (ctx) => {
  try {
    const playerTag = ctx.match[1];
    const player = await cocApi.getPlayer(playerTag);
    
    if (!player) {
      await ctx.answerCallbackQuery({
        text: 'Player not found',
        show_alert: true
      });
      return;
    }

    const message = playerUtils.formatPlayerInfo(player);
    const keyboard = playerUtils.createPlayerKeyboard(playerTag);

    // Check if the message content is different before editing
    const currentMessage = ctx.callbackQuery.message;
    if (currentMessage && currentMessage.text === message) {
      // If content is the same, just answer the callback query
      await ctx.answerCallbackQuery();
      return;
    }

    await ctx.editMessageText(message, {
      parse_mode: 'MarkdownV2',
      reply_markup: keyboard
    });
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error handling back button:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching player info',
      show_alert: true
    });
  }
});

export default composer; 