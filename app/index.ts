import bot from './bot.js';
import config from './config.js';

// Start the bot
async function startBot() {
  try {
    await bot.start({
      onStart: (botInfo) => {
        console.log(`Bot @${botInfo.username} is running!`);
        console.log('Bot is ready to receive commands.');
      },
    });
  } catch (err) {
    console.error('Failed to start bot:', err);
    process.exit(1);
  }
}

// Handle process termination
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

// Start the bot
startBot(); 