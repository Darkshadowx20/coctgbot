import { NextFunction } from 'grammy';
import { MyContext } from '../types/bot.js';

/**
 * Simple logging middleware
 */
export default async (ctx: MyContext, next: NextFunction): Promise<void> => {
  const start = Date.now();
  
  // Get user information
  const userId = ctx.from?.id ?? 'unknown';
  const username = ctx.from?.username ? `@${ctx.from.username}` : ctx.from?.first_name ?? 'unknown';

  // Get message information
  const messageText = ctx.message?.text ?? ctx.callbackQuery?.data ?? 'unknown';
  const chatType = ctx.chat?.type ?? 'unknown';
  const chatId = ctx.chat?.id ?? 'unknown';
  
  // Log the request
  console.log(`[${new Date().toISOString()}] Request from ${username} (${userId}) in ${chatType} (${chatId}): ${messageText}`);
  
  // Process the request
  await next();
  
  // Log the response time
  const responseTime = Date.now() - start;
  console.log(`[${new Date().toISOString()}] Response time: ${responseTime}ms`);
}; 