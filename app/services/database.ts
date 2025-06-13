import fs from 'fs/promises';
import config from '../config/index.js';

// User data interface
export interface UserData {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  playerTag?: string;
  clanTag?: string;
  lastActivity?: Date;
}

/**
 * Database service for JSON-based persistence
 */
class Database {
  private users: Map<number, UserData> = new Map();
  private initialized = false;

  /**
   * Initialize the database
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Ensure DB directory exists
      await fs.mkdir(config.db.dbDir, { recursive: true });
      
      // Load users data if exists
      try {
        const data = await fs.readFile(config.db.userDbPath, 'utf-8');
        const usersArray: UserData[] = JSON.parse(data);
        
        // Populate the map
        usersArray.forEach(user => {
          this.users.set(user.id, user);
        });
        
        console.log(`Loaded ${this.users.size} users from database`);
      } catch (error) {
        // If file doesn't exist, create empty database
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          await this.saveUsers();
          console.log('Created new users database');
        } else {
          throw error;
        }
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Save users to JSON file
   */
  private async saveUsers(): Promise<void> {
    try {
      const usersArray = Array.from(this.users.values());
      await fs.writeFile(config.db.userDbPath, JSON.stringify(usersArray, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving users:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   */
  async getUser(userId: number): Promise<UserData | undefined> {
    await this.ensureInitialized();
    return this.users.get(userId);
  }

  /**
   * Create or update a user
   */
  async upsertUser(userData: UserData): Promise<void> {
    await this.ensureInitialized();
    this.users.set(userData.id, userData);
    await this.saveUsers();
  }

  /**
   * Update user properties
   */
  async updateUser(userId: number, updates: Partial<UserData>): Promise<UserData | undefined> {
    await this.ensureInitialized();
    
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Apply updates
    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    
    await this.saveUsers();
    return updatedUser;
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: number): Promise<boolean> {
    await this.ensureInitialized();
    
    const result = this.users.delete(userId);
    if (result) {
      await this.saveUsers();
    }
    
    return result;
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }
}

// Export a singleton instance
const db = new Database();
export default db; 