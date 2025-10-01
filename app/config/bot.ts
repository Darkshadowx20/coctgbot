import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Bot configuration
export default {
  // Bot token from environment variables
  token: process.env.BOT_TOKEN || '',
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Bot settings
  settings: {
    // Maximum number of results to show in rankings
    maxRankings: 10,
    
    // Maximum number of clan members to show
    maxClanMembers: 20,
    
    // Maximum number of war log entries to show
    maxWarLogEntries: 5,
    
    // Default parse mode for messages
    parseMode: 'Markdown',
    
    // Command throttling in milliseconds
    commandThrottling: 1000
  },
  
  // Admin user IDs
  adminUsers: (process.env.ADMIN_USERS || '').split(',').filter(Boolean).map(Number)
}; 