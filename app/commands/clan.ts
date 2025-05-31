import { Composer } from 'grammy';
import { getClan } from '../services/cocApi.js';
import { 
  formatClanInfo, 
  formatClanMembers, 
  formatTopDonators,
  createClanKeyboard 
} from '../utils/formatClan.js';

// Create a composer to handle /clan commands
const composer = new Composer();

// Handler for /clan command
composer.command('clan', async (ctx) => {
  const args = ctx.match.trim();
  
  if (!args) {
    return ctx.reply(
      'Please provide a clan tag.\n' +
      'Usage: /clan <tag>\n' +
      'Example: /clan #ABC123'
    );
  }

  try {
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get clan data
    const clan = await getClan(args);
    
    // Format and send clan info with inline keyboard
    await ctx.reply(formatClanInfo(clan), {
      parse_mode: 'Markdown',
      reply_markup: createClanKeyboard(clan.tag)
    });
    
  } catch (error) {
    console.error('Error fetching clan:', error);
    await ctx.reply(
      `Error: ${error instanceof Error ? error.message : 'Failed to fetch clan data'}\n` +
      'Make sure the clan tag is correct and try again.'
    );
  }
});

// Handle callback queries for clan details
composer.callbackQuery(/^members_(.+)$/, async (ctx) => {
  try {
    // Extract clan tag from callback data
    const clanTag = ctx.match[1];
    
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get clan data
    const clan = await getClan(clanTag);
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // Send members info
    await ctx.reply(formatClanMembers(clan), {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error fetching clan members:', error);
    await ctx.answerCallbackQuery({ text: 'Error fetching members data', show_alert: true });
  }
});

composer.callbackQuery(/^donators_(.+)$/, async (ctx) => {
  try {
    // Extract clan tag from callback data
    const clanTag = ctx.match[1];
    
    // Show typing indicator
    if (ctx.chat) {
      await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    }
    
    // Get clan data
    const clan = await getClan(clanTag);
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // Send top donators info
    await ctx.reply(formatTopDonators(clan), {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error fetching clan donators:', error);
    await ctx.answerCallbackQuery({ text: 'Error fetching donators data', show_alert: true });
  }
});

composer.callbackQuery(/^warlog_(.+)$/, async (ctx) => {
  try {
    // Extract clan tag from callback data
    const clanTag = ctx.match[1];
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // War log feature - placeholder for future implementation
    await ctx.reply("War log feature will be available in a future update.", {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error with war log:', error);
    await ctx.answerCallbackQuery({ text: 'Error with war log feature', show_alert: true });
  }
});

composer.callbackQuery(/^currentwar_(.+)$/, async (ctx) => {
  try {
    // Extract clan tag from callback data
    const clanTag = ctx.match[1];
    
    // Answer the callback query
    await ctx.answerCallbackQuery();
    
    // Current war feature - placeholder for future implementation
    await ctx.reply("Current war feature will be available in a future update.", {
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error with current war:', error);
    await ctx.answerCallbackQuery({ text: 'Error with current war feature', show_alert: true });
  }
});

export default composer; 