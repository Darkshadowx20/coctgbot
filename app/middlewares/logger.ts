import { NextFunction } from 'grammy';
import type { Context } from 'grammy';

/**
 * Logger middleware for Grammy
 * Logs all incoming messages and commands
 */
export function logger(ctx: Context, next: NextFunction) {
  const from = ctx.from?.username 
    ? `@${ctx.from.username}` 
    : ctx.from?.first_name || 'Unknown';

  const chatType = ctx.chat?.type || 'unknown';
  
  if (ctx.message?.text) {
    console.log(`[${new Date().toISOString()}] ${from} in ${chatType}: ${ctx.message.text}`);
  } else if (ctx.callbackQuery?.data) {
    console.log(`[${new Date().toISOString()}] ${from} callback: ${ctx.callbackQuery.data}`);
  }
  
  return next();
}

export default logger; 