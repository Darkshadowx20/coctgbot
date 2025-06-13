import { Context, SessionFlavor } from 'grammy';

/**
 * Session data structure
 */
export interface SessionData {
  // Session-specific data (temporary)
  tempData?: Record<string, any>;
}

/**
 * User data available in context
 */
export interface ContextUser {
  id: number;
  playerTag?: string;
  clanTag?: string;
}

/**
 * Custom context type for the bot
 */
export type MyContext = Context & SessionFlavor<SessionData> & {
  user?: ContextUser;
}; 