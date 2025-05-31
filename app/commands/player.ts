import { Composer } from 'grammy';
import { getPlayer } from '../services/cocApi.js';
import { 
  formatPlayerInfo, 
  formatHeroes, 
  formatTroops,
  formatSpells,
  formatAchievements,
  createPlayerKeyboard,
  createBackToPlayerKeyboard
} from '../utils/formatPlayer.js';

// Create a composer to handle /player commands
const composer = new Composer();

// Handler for /player command
composer.command('player', async (ctx) => {
  const args = ctx.match.trim();
  
  if (!args) {
    return ctx.reply(
      'Please provide a player tag.\n' +
      'Usage: /player <tag>\n' +
      'Example: /player #ABC123'
    );
  }

  try {
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get player data
    const player = await getPlayer(args);
    
    // Format and send player info with inline keyboard
    await ctx.reply(formatPlayerInfo(player), {
      parse_mode: 'Markdown',
      reply_markup: createPlayerKeyboard(player.tag)
    });
    
  } catch (error) {
    console.error('Error fetching player:', error);
    await ctx.reply(
      `Error: ${error instanceof Error ? error.message : 'Failed to fetch player data'}\n` +
      'Make sure the player tag is correct and try again.'
    );
  }
});

// Handle back button to player info
composer.callbackQuery(/^back_to_player_(.+)$/, async (ctx) => {
  try {
    // Extract player tag from callback data
    const playerTag = ctx.match[1];
    
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get player data
    const player = await getPlayer(playerTag);
    
    // Answer the callback query
    await ctx.answerCallbackQuery({ text: "Returning to player info" });
    
    // Send player info
    await ctx.editMessageText(formatPlayerInfo(player), {
      parse_mode: 'Markdown',
      reply_markup: createPlayerKeyboard(player.tag)
    });
  } catch (error) {
    console.error('Error returning to player info:', error);
    await ctx.answerCallbackQuery({ text: 'Error returning to player info', show_alert: true });
  }
});

// Handle callback queries for player details
composer.callbackQuery(/^heroes_(.+)$/, async (ctx) => {
  try {
    // Extract player tag from callback data
    const playerTag = ctx.match[1];
    
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get player data
    const player = await getPlayer(playerTag);
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // Send heroes info with back button
    await ctx.reply(`*Heroes of ${escapeMarkdown(player.name)}:*\n\n${formatHeroes(player)}`, {
      parse_mode: 'Markdown',
      reply_markup: createBackToPlayerKeyboard(player.tag)
    });
  } catch (error) {
    console.error('Error fetching player heroes:', error);
    await ctx.answerCallbackQuery({ text: 'Error fetching heroes data', show_alert: true });
  }
});

composer.callbackQuery(/^troops_(.+)$/, async (ctx) => {
  try {
    // Extract player tag from callback data
    const playerTag = ctx.match[1];
    
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get player data
    const player = await getPlayer(playerTag);
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // Send troops info with back button
    await ctx.reply(`*Top Troops of ${escapeMarkdown(player.name)}:*\n\n${formatTroops(player)}`, {
      parse_mode: 'Markdown',
      reply_markup: createBackToPlayerKeyboard(player.tag)
    });
  } catch (error) {
    console.error('Error fetching player troops:', error);
    await ctx.answerCallbackQuery({ text: 'Error fetching troops data', show_alert: true });
  }
});

composer.callbackQuery(/^spells_(.+)$/, async (ctx) => {
  try {
    // Extract player tag from callback data
    const playerTag = ctx.match[1];
    
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get player data
    const player = await getPlayer(playerTag);
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // Send spells info with back button
    await ctx.reply(`*Spells of ${escapeMarkdown(player.name)}:*\n\n${formatSpells(player)}`, {
      parse_mode: 'Markdown',
      reply_markup: createBackToPlayerKeyboard(player.tag)
    });
  } catch (error) {
    console.error('Error fetching player spells:', error);
    await ctx.answerCallbackQuery({ text: 'Error fetching spells data', show_alert: true });
  }
});

composer.callbackQuery(/^achievements_(.+)$/, async (ctx) => {
  try {
    // Extract player tag from callback data
    const playerTag = ctx.match[1];
    
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get player data
    const player = await getPlayer(playerTag);
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // Send achievements info with back button
    await ctx.reply(`*Top Achievements of ${escapeMarkdown(player.name)}:*\n\n${formatAchievements(player)}`, {
      parse_mode: 'Markdown',
      reply_markup: createBackToPlayerKeyboard(player.tag)
    });
  } catch (error) {
    console.error('Error fetching player achievements:', error);
    await ctx.answerCallbackQuery({ text: 'Error fetching achievements data', show_alert: true });
  }
});

// Helper function to escape markdown
function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
}

export default composer; 