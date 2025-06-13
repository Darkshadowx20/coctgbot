import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';

const composer = new Composer<MyContext>();

// Add help command
composer.command('help', async (ctx) => {
  await ctx.reply(
    '*Clash of Clans Bot Commands:*\n\n' +
    '• `/player <tag>` - Get player information\n' +
    '• `/clan <tag>` - Get clan information\n' +
    '• `/setplayer <tag>` - Save your player tag\n' +
    '• `/setclan <tag>` - Save your clan tag\n' +
    '• `/info` - Show your saved player info\n' +
    '• `/infoclan` - Show your saved clan info\n' +
    '• `/help` - Show this help message\n\n' +
    'Example: `/player #ABC123`',
    { parse_mode: 'Markdown' }
  );
});

// Add start command (same as help but with welcome message)
composer.command('start', async (ctx) => {
  await ctx.reply(
    '*Welcome to Clash of Clans Bot!* 🎮\n\n' +
    'This bot allows you to check information about Clash of Clans players and clans.\n\n' +
    '*Available commands:*\n' +
    '• `/player <tag>` - Get player information\n' +
    '• `/clan <tag>` - Get clan information\n' +
    '• `/setplayer <tag>` - Save your player tag\n' +
    '• `/setclan <tag>` - Save your clan tag\n' +
    '• `/info` - Show your saved player info\n' +
    '• `/infoclan` - Show your saved clan info\n' +
    '• `/help` - Show this help message\n\n' +
    'Example: `/player #ABC123`',
    { parse_mode: 'Markdown' }
  );
});

export default composer; 