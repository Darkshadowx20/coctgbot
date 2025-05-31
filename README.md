# Clash of Clans Telegram Bot

A Telegram bot built with Grammy that provides information about Clash of Clans players and clans.

## Features

- `/player [tag]` - Get information about a player
- `/clan [tag]` - Get information about a clan

## Setup

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env` file with the following variables:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   COC_API_KEY=your_clash_of_clans_api_key_here
   ```
4. Run the bot in development mode with `npm run dev`
5. Build the bot for production with `npm run build`
6. Start the production bot with `npm start`

## Project Structure

```
├── app/
│   ├── bot.ts                # Main bot entry point
│   ├── config.ts             # Config & tokens
│   ├── commands/
│   │   ├── player.ts         # /player command logic
│   │   ├── clan.ts           # /clan command logic
│   │   └── index.ts          # Command loader
│   ├── services/
│   │   └── cocApi.ts         # Clash of Clans API wrapper
│   ├── middlewares/
│   │   └── logger.ts         # Logging middleware
│   ├── utils/
│   │   └── formatPlayer.ts   # Format API responses
│   └── types/
│       └── coc.ts            # Type definitions for CoC
``` 