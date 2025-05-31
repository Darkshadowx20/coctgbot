import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import cocApi from '../services/cocApi.js';
import playerUtils from '../utils/formatPlayer.js';
import { handleApiError } from '../utils/errors.js';

const composer = new Composer<MyContext>();

/**
 * Command to get player information
 * Usage: /player <player_tag>
 */
composer.command('player', async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    return ctx.reply('Usage: /player <player_tag>\nExample: /player #2PGGJ20V');
  }
  
  let playerTag = args[0];
  
  // Add # if missing
  if (!playerTag.startsWith('#')) {
    playerTag = '#' + playerTag;
  }

  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.reply(playerUtils.formatPlayerInfo(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createPlayerKeyboard(playerTag)
    });
  } catch (error) {
    await handleApiError(ctx, error, 'player');
  }
});

/**
 * Command to search for top players
 * Usage: /topplayers [country_code]
 */
composer.command(['topplayers', 'top'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  let locationId = 0; // Global by default
  
  if (args && args.length > 0 && args[0]) {
    // Try to get location by country code
    try {
      const locations = await cocApi.getLocations();
      const location = locations.items.find((loc: any) => 
        loc.countryCode && loc.countryCode.toLowerCase() === args[0].toLowerCase()
      );
      
      if (location) {
        locationId = location.id;
      } else {
        return ctx.reply(`Could not find location with country code: ${args[0]}\nUsing global rankings instead.`);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Continue with global rankings
    }
  }
  
  try {
    const rankings = await cocApi.getPlayerRankings(locationId);
    
    await ctx.reply(playerUtils.formatPlayerRankings(rankings), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'player rankings');
  }
});

/**
 * Command to search for top builder base players
 * Usage: /topbuilder [country_code]
 */
composer.command(['topbuilder', 'topbb'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  let locationId = 0; // Global by default
  
  if (args && args.length > 0 && args[0]) {
    // Try to get location by country code
    try {
      const locations = await cocApi.getLocations();
      const location = locations.items.find((loc: any) => 
        loc.countryCode && loc.countryCode.toLowerCase() === args[0].toLowerCase()
      );
      
      if (location) {
        locationId = location.id;
      } else {
        return ctx.reply(`Could not find location with country code: ${args[0]}\nUsing global rankings instead.`);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Continue with global rankings
    }
  }
  
  try {
    const rankings = await cocApi.getPlayerVersusBattleRankings(locationId);
    
    await ctx.reply(playerUtils.formatPlayerVersusBattleRankings(rankings), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'builder base rankings');
  }
});

/**
 * Command to get league rankings
 * Usage: /leaguerankings <league_id> [season_id]
 */
composer.command(['leaguerankings', 'leagueranks'], async (ctx) => {
  const args = ctx.message?.text?.split(' ').slice(1);
  
  if (!args || args.length === 0 || !args[0]) {
    try {
      // Get leagues and display them
      const leagues = await cocApi.getLeagues();
      const leaguesList = leagues.items
        .filter(league => league.id >= 29000000) // Filter out lower leagues
        .map(league => `${league.name}: ID ${league.id}`)
        .join('\n');
      
      return ctx.reply(`Usage: /leaguerankings <league_id> [season_id]\n\nAvailable leagues:\n${leaguesList}`);
    } catch (error) {
      return ctx.reply('Usage: /leaguerankings <league_id> [season_id]\nExample: /leaguerankings 29000022');
    }
  }
  
  const leagueId = parseInt(args[0]);
  let seasonId = 'latest';
  
  if (args.length > 1 && args[1]) {
    seasonId = args[1];
    }
    
  try {
    // Get league info for the name
    let leagueName = 'League';
    try {
      const league = await cocApi.getLeague(leagueId);
      leagueName = league.name;
    } catch (error) {
      console.error('Error fetching league info:', error);
      // Continue with default name
    }
    
    const rankings = await cocApi.getLeagueSeasonRankings(leagueId, seasonId);
    
    await ctx.reply(playerUtils.formatLeagueSeasonRankings(rankings, leagueName, seasonId), {
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await handleApiError(ctx, error, 'league rankings');
  }
});

/**
 * Callback queries for player details
 */
composer.callbackQuery(/^troops_(.+)$/, async (ctx) => {
    const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerTroops(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player troops');
    console.error('Error fetching player troops:', error);
  }
});

composer.callbackQuery(/^heroes_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
  
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerHeroes(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player heroes');
    console.error('Error fetching player heroes:', error);
  }
});

composer.callbackQuery(/^spells_(.+)$/, async (ctx) => {
    const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerSpells(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player spells');
    console.error('Error fetching player spells:', error);
  }
});

composer.callbackQuery(/^achievements_(.+)$/, async (ctx) => {
    const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerAchievements(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player achievements');
    console.error('Error fetching player achievements:', error);
  }
});

composer.callbackQuery(/^back_to_player_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
  
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerInfo(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createPlayerKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player info');
    console.error('Error fetching player info:', error);
}
});

export default composer; 