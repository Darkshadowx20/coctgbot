import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API configuration
export default {
  // Clash of Clans API base URL
  baseUrl: 'https://api.clashofclans.com/v1',
  
  // API key from environment variables
  apiKey: process.env.COC_API_KEY || '',
  
  // Default request timeout in milliseconds
  timeout: 10000,
  
  // Default headers
  headers: {
    'Accept': 'application/json',
  },
  
  // Default request parameters
  defaultParams: {
    limit: 20
  },
  
  // Rate limiting settings
  rateLimit: {
    maxRequests: 10,
    timeWindow: 1000, // 1 second
    enabled: true
  }
}; 