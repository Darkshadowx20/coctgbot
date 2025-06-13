import { NextFunction } from 'grammy';
import { MyContext } from '../types/bot.js';
import userService from '../services/userService.js';

/**
 * Middleware to track users and update their activity
 */
export default async (ctx: MyContext, next: NextFunction): Promise<void> => {
  // Only process if we have user information
  if (ctx.from) {
    const { id, username, first_name, last_name } = ctx.from;
    
    // Get or create user
    await userService.getOrCreateUser(id, username, first_name, last_name);
    
    // Update user activity
    await userService.updateActivity(id);
    
    // Store user data in context for easy access
    ctx.user = {
      id,
      playerTag: await userService.getPlayerTag(id),
      clanTag: await userService.getClanTag(id)
    };
  }
  
  // Continue processing
  await next();
}; 