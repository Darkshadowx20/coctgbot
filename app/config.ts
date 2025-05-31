import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Check if required environment variables are set
if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN environment variable is required');
}

if (!process.env.COC_API_KEY) {
  throw new Error('COC_API_KEY environment variable is required');
}

export default {
  botToken: process.env.BOT_TOKEN,
  cocApiKey: process.env.COC_API_KEY,
}; 