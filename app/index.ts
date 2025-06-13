import bot from './bot.js';
import config from './config.js';

// Start the bot
async function main() {
  console.log(`Starting Clash of Clans bot in ${config.NODE_ENV} mode...`);
  
  try {
    // The bot.ts file now handles initialization and startup
    // This file just serves as an entry point
    await import('./bot.js');
    
    console.log(`Bot started successfully in ${config.NODE_ENV} mode.`);
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

// Start the application
main().catch(console.error); 