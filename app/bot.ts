import { Bot, session } from 'grammy';
import { MyContext, SessionData } from './types/bot.js';
import playerCommands from './commands/player.js';
import clanCommands from './commands/clan.js';
import config from './config.js';
import logger from './middlewares/logger.js';

// Create the bot
const bot = new Bot<MyContext>(config.BOT_TOKEN);

// Configure session
bot.use(session({
  initial(): SessionData {
    return {};
  }
}));

// Use logger middleware
bot.use(logger);

// Register commands
bot.use(playerCommands);
bot.use(clanCommands);

// Helper function to escape MarkdownV2 special characters
function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
}

// Help command
bot.command('help', async (ctx) => {
  const helpText = `
*Clash of Clans Bot Commands*

*Player Commands:*
/player \\<tag\\> \\- Get player information
/topplayers \\[country\\_code\\] \\- Get top players
/topbuilder \\[country\\_code\\] \\- Get top builder base players
/leaguerankings \\<league\\_id\\> \\[season\\_id\\] \\- Get league rankings

*Clan Commands:*
/clan \\<tag\\> \\- Get clan information
/clansearch \\<name\\> \\[min\\_members\\] \\[max\\_members\\] \\[min\\_level\\] \\- Search for clans
/clanmembers \\<tag\\> \\- Get clan members
/clanwarlog \\<tag\\> \\- Get clan war log
/currentwar \\<tag\\> \\- Get current clan war
/capitalraids \\<tag\\> \\- Get clan capital raid seasons
/clanwarleague \\<tag\\> \\- Get clan war league group
/topclans \\[country\\_code\\] \\- Get top clans
/topbuilderclans \\[country\\_code\\] \\- Get top builder base clans

*Other Commands:*
/help \\- Show this help message
`;

  await ctx.reply(helpText, {
    parse_mode: 'MarkdownV2'
  });
});

// Start command
bot.command('start', async (ctx) => {
  const startText = `
*Welcome to the Clash of Clans Bot\\!*

This bot allows you to get information about players and clans in Clash of Clans\\.

Use /help to see available commands\\.
`;

  await ctx.reply(startText, {
    parse_mode: 'MarkdownV2'
  });
});

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start the bot
console.log('Starting Clash of Clans bot...');
bot.start({
  onStart: (botInfo) => {
    console.log(`Bot @${botInfo.username} is running!`);
    console.log('Bot is ready to receive commands.');
  },
});

// Handle process termination
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

export default bot; 