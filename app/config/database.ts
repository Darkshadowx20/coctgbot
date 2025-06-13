import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
export default {
  // Database directory path
  dbDir: path.join(__dirname, '../../data'),
  
  // User database file path
  userDbPath: path.join(__dirname, '../../data/users.json'),
  
  // Settings database file path
  settingsDbPath: path.join(__dirname, '../../data/settings.json'),
  
  // Cache database file path
  cacheDbPath: path.join(__dirname, '../../data/cache.json'),
  
  // Cache expiration time in milliseconds (default: 1 hour)
  cacheExpiration: 60 * 60 * 1000,
  
  // Auto-save interval in milliseconds (default: 5 minutes)
  autoSaveInterval: 5 * 60 * 1000
}; 