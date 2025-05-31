import { Composer } from 'grammy';
import { getPlayer } from '../services/cocApi.js';
import { formatPlayerInfo, formatHeroes, formatTroops } from '../utils/formatPlayer.js';

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
    await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    
    // Get player data
    const player = await getPlayer(args);
    
    // Format and send player info
    await ctx.reply(formatPlayerInfo(player), {
      parse_mode: 'Markdown',
    });
    
    // Send heroes info if available
    if (player.heroes && player.heroes.length > 0) {
      await ctx.reply(`*Heroes:*\n${formatHeroes(player)}`, {
        parse_mode: 'Markdown',
      });
    }
    
    // Send top troops info
    await ctx.reply(`*Top Troops:*\n${formatTroops(player)}`, {
      parse_mode: 'Markdown',
    });
    
  } catch (error) {
    console.error('Error fetching player:', error);
    await ctx.reply(
      `Error: ${error instanceof Error ? error.message : 'Failed to fetch player data'}\n` +
      'Make sure the player tag is correct and try again.'
    );
  }
});

export default composer; 