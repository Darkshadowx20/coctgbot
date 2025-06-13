# Clash of Clans Telegram Bot

A Telegram bot built with Grammy that provides information about Clash of Clans players and clans.

## Features

- `/player [tag]` - Get information about a player
- `/clan [tag]` - Get information about a clan
- `/setplayer [tag]` - Save your player tag for quick access
- `/setclan [tag]` - Save your clan tag for quick access
- `/info` - View your saved player profile
- `/infoclan` - View your saved clan profile

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file with the following variables:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   COC_API_KEY=your_clash_of_clans_api_key_here
   NODE_ENV=development
   ADMIN_USERS=123456789,987654321
   ```
4. Run the bot in development mode with `npm run dev`
5. Build the bot for production with `npm run build`
6. Start the production bot with `npm start`

## Project Structure

```
├── app/
│   ├── bot.ts                # Main bot entry point
│   ├── index.ts              # Application entry point
│   ├── config/               # Configuration modules
│   │   ├── index.ts          # Config aggregator
│   │   ├── api.ts            # API-related settings
│   │   ├── bot.ts            # Bot-related settings
│   │   └── database.ts       # Database settings
│   ├── commands/             # Command handlers
│   │   ├── index.ts          # Command aggregator
│   │   ├── common.ts         # Common commands (help, start)
│   │   ├── player.ts         # Player info commands
│   │   ├── clan.ts           # Clan info commands
│   │   └── user.ts           # User preference commands
│   ├── callbacks/            # Callback query handlers
│   │   ├── index.ts          # Callback aggregator
│   │   ├── player.ts         # Player-related callbacks
│   │   └── clan.ts           # Clan-related callbacks
│   ├── services/             # Service layer
│   │   ├── cocApi.ts         # Clash of Clans API wrapper
│   │   ├── database.ts       # JSON database service
│   │   └── userService.ts    # User management service
│   ├── middlewares/          # Bot middlewares
│   │   ├── logger.ts         # Logging middleware
│   │   └── userTracker.ts    # User tracking middleware
│   ├── utils/                # Utility functions
│   │   ├── formatPlayer.ts   # Format player data
│   │   ├── formatClan.ts     # Format clan data
│   │   └── errors.ts         # Error handling utilities
│   └── types/                # Type definitions
│       ├── bot.ts            # Bot type definitions
│       └── coc.ts            # CoC API type definitions
├── data/                     # Database storage (JSON files)
│   └── users.json            # User preferences database
```

## Database

The bot uses a simple JSON-based database to persist user data. User preferences like player tags and clan tags are stored in the `data/users.json` file.

## Architecture

- **Modular Design**: The codebase is organized into modules with clear responsibilities
- **Service Layer**: Business logic is encapsulated in service classes
- **Middleware Pattern**: Uses Grammy middleware for logging and user tracking
- **Persistent Storage**: User data is stored in JSON files for persistence between restarts
- **Configuration System**: Centralized configuration with environment variable support
- **Callback Separation**: Callback query handlers are separated from command handlers 

# cmd
### pnpm run prod - Build and start the bot in production
### pnpm run stop - Stop the bot
### run restart - Restart the bot
### pnpm run logs - View logs
### pnpm run status - Check bot status
### pnpm run monit - Monitor the bot in real-time