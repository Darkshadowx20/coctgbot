import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration object
const config = {
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  COC_API_KEY: process.env.COC_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
if (!config.BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable is required');
}

if (!config.COC_API_KEY) {
  throw new Error('COC_API_KEY environment variable is required');
}

export default config; 