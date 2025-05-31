import { Bot, session } from 'grammy';
import config from './config.js';
import commands from './commands/index.js';
import logger from './middlewares/logger.js';

// Create bot instance
const bot = new Bot(config.botToken);

// Use session middleware
bot.use(session({ initial: () => ({}) }));

// Use logger middleware
bot.use(logger);

// Register all commands
bot.use(commands);

// Handle errors
bot.catch((err) => {
  console.error('Bot error occurred:', err);
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