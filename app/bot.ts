import { Bot, session } from 'grammy';
import { MyContext, SessionData } from './types/bot.js';
import commands from './commands/index.js';
import callbacks from './callbacks/index.js';
import config from './config/index.js';
import logger from './middlewares/logger.js';
import userTracker from './middlewares/userTracker.js';
import db from './services/database.js';

// Initialize database
async function initDatabase() {
  try {
    await db.init();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Create the bot
const bot = new Bot<MyContext>(config.bot.token);

// Configure session with memory storage (in production, use a database)
bot.use(session({
  initial(): SessionData {
    return {
      tempData: {}
    };
  }
}));

// Use middlewares
bot.use(logger);
bot.use(userTracker);

// Register commands and callbacks
bot.use(commands);
bot.use(callbacks);

// Helper function to escape Markdown special characters
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
    parse_mode: 'Markdown'
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
    parse_mode: 'Markdown'
  });
});

// Error handling
bot.catch((err) => {
  console.error('Bot error:', err);
});

// Start the bot
async function startBot() {
  console.log(`Starting Clash of Clans bot in ${config.bot.environment} mode...`);
  
  // Initialize database first
  await initDatabase();
  
  // Then start the bot
  await bot.start({
    onStart: (botInfo) => {
      console.log(`Bot @${botInfo.username} is running!`);
      console.log('Bot is ready to receive commands.');
    },
  });
}

// Handle process termination
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

// Start the bot if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startBot().catch(err => {
    console.error('Failed to start bot:', err);
    process.exit(1);
  });
}

export default bot; 