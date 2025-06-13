import db, { UserData } from './database.js';

/**
 * User service for managing user data
 */
class UserService {
  /**
   * Get or create a user
   */
  async getOrCreateUser(userId: number, username?: string, firstName?: string, lastName?: string): Promise<UserData> {
    let user = await db.getUser(userId);
    
    if (!user) {
      user = {
        id: userId,
        username,
        firstName,
        lastName,
        lastActivity: new Date()
      };
      
      await db.upsertUser(user);
    }
    
    return user;
  }

  /**
   * Save player tag for a user
   */
  async savePlayerTag(userId: number, playerTag: string): Promise<UserData | undefined> {
    return await db.updateUser(userId, { 
      playerTag,
      lastActivity: new Date() 
    });
  }

  /**
   * Save clan tag for a user
   */
  async saveClanTag(userId: number, clanTag: string): Promise<UserData | undefined> {
    return await db.updateUser(userId, { 
      clanTag,
      lastActivity: new Date() 
    });
  }

  /**
   * Get player tag for a user
   */
  async getPlayerTag(userId: number): Promise<string | undefined> {
    const user = await db.getUser(userId);
    return user?.playerTag;
  }

  /**
   * Get clan tag for a user
   */
  async getClanTag(userId: number): Promise<string | undefined> {
    const user = await db.getUser(userId);
    return user?.clanTag;
  }

  /**
   * Update user activity timestamp
   */
  async updateActivity(userId: number): Promise<void> {
    await db.updateUser(userId, { lastActivity: new Date() });
  }
}

// Export a singleton instance
const userService = new UserService();
export default userService; 