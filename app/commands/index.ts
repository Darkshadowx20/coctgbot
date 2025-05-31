import { Composer } from 'grammy';
import playerCommand from './player.js';
import clanCommand from './clan.js';

// Create a composer to combine all commands
const composer = new Composer();

// Register all commands
composer.use(playerCommand);
composer.use(clanCommand);

// Add help command
composer.command('help', async (ctx) => {
  await ctx.reply(
    '*Clash of Clans Bot Commands:*\n\n' +
    '• `/player <tag>` - Get player information\n' +
    '• `/clan <tag>` - Get clan information\n' +
    '• `/help` - Show this help message\n\n' +
    'Example: `/player #ABC123`',
    { parse_mode: 'Markdown' }
  );
});

// Add start command (same as help)
composer.command('start', async (ctx) => {
  await ctx.reply(
    '*Welcome to Clash of Clans Bot!* 🎮\n\n' +
    'This bot allows you to check information about Clash of Clans players and clans.\n\n' +
    '*Available commands:*\n' +
    '• `/player <tag>` - Get player information\n' +
    '• `/clan <tag>` - Get clan information\n' +
    '• `/help` - Show this help message\n\n' +
    'Example: `/player #ABC123`',
    { parse_mode: 'Markdown' }
  );
});

export default composer; 