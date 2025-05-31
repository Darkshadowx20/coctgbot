import bot from './bot.js';
import config from './config.js';

// Start the bot
async function startBot() {
  console.log('Starting Clash of Clans bot...');
  
  try {
    await bot.start();
    console.log(`Bot started successfully in ${config.NODE_ENV} mode.`);
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

// Start the application
startBot().catch(console.error); 