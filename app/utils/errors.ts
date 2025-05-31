import { Context } from 'grammy';

/**
 * Handle API errors in a consistent way
 */
export async function handleApiError(ctx: Context, error: unknown, contextName: string): Promise<void> {
  console.error(`Error in ${contextName}:`, error);
  
  let errorMessage = 'An error occurred while fetching data.';
  
  if (error instanceof Error) {
    if (error.message.includes('404')) {
      errorMessage = `Could not find the requested ${contextName}. Please check the tag and try again.`;
    } else if (error.message.includes('403') || error.message.includes('accessDenied')) {
      if (contextName === 'clan war log' || contextName === 'current war') {
        errorMessage = 'Access denied. The clan war log might be private.';
      } else if (contextName === 'player') {
        errorMessage = 'Access denied. The player profile might be private or the API key may not have access to this player.';
      } else {
        errorMessage = 'Access denied. Please check if you have permission to view this information.';
      }
    } else if (error.message.includes('429')) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.message.includes('503')) {
      errorMessage = 'The Clash of Clans API is currently unavailable. Please try again later.';
    } else if (error.message.includes('invalidIp')) {
      errorMessage = 'API key not authorized for this IP address. Please update your API key settings.';
    } else {
      errorMessage = `Error: ${error.message}`;
    }
  }
  
  await ctx.reply(errorMessage);
}

export default {
  handleApiError
}; 