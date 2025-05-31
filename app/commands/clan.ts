import { Composer } from 'grammy';
import { getClan } from '../services/cocApi.js';
import { formatClanInfo, formatClanMembers } from '../utils/formatClan.js';

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
    await ctx.api.sendChatAction(ctx.chat.id, 'typing');
    
    // Get clan data
    const clan = await getClan(args);
    
    // Format and send clan info
    await ctx.reply(formatClanInfo(clan), {
      parse_mode: 'Markdown',
    });
    
    // Send members info if available
    if (clan.memberList && clan.memberList.length > 0) {
      await ctx.reply(formatClanMembers(clan), {
        parse_mode: 'Markdown',
      });
    }
    
  } catch (error) {
    console.error('Error fetching clan:', error);
    await ctx.reply(
      `Error: ${error instanceof Error ? error.message : 'Failed to fetch clan data'}\n` +
      'Make sure the clan tag is correct and try again.'
    );
  }
});

export default composer; 