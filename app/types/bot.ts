import { Context, SessionFlavor } from 'grammy';

/**
 * Session data structure
 */
export interface SessionData {
  // Add any session data properties here
}

/**
 * Custom context type for the bot
 */
export type MyContext = Context & SessionFlavor<SessionData>; 