import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import cocApi from '../services/cocApi.js';
import playerUtils from '../utils/formatPlayer.js';
import { escapeMarkdown } from '../utils/formatClan.js';

const composer = new Composer<MyContext>();

/**
 * Callback queries for player details
 */
composer.callbackQuery(/^troops_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    // Show the troop types sub-menu instead of displaying troops directly
    await ctx.editMessageText(`*Select Troop Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createTroopTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player troops');
    console.error('Error fetching player troops:', error);
  }
});

// Add handlers for new troop type buttons
composer.callbackQuery(/^all_troops_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerTroops(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createTroopTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player troops');
    console.error('Error fetching player troops:', error);
  }
});

composer.callbackQuery(/^elixir_troops_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerElixirTroops(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createTroopTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching elixir troops');
    console.error('Error fetching elixir troops:', error);
  }
});

composer.callbackQuery(/^dark_troops_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerDarkTroops(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createTroopTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching dark troops');
    console.error('Error fetching dark troops:', error);
  }
});

composer.callbackQuery(/^hero_pets_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerHeroPets(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createTroopTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching hero pets');
    console.error('Error fetching hero pets:', error);
  }
});

composer.callbackQuery(/^siege_machines_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerSiegeMachines(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createTroopTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching siege machines');
    console.error('Error fetching siege machines:', error);
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
    
    // Show the spell types sub-menu instead of displaying spells directly
    await ctx.editMessageText(`*Select Spell Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createSpellTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player spells');
    console.error('Error fetching player spells:', error);
  }
});

// Add handlers for spell type buttons
composer.callbackQuery(/^all_spells_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerSpells(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createSpellTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player spells');
    console.error('Error fetching player spells:', error);
  }
});

composer.callbackQuery(/^elixir_spells_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerElixirSpells(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createSpellTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching elixir spells');
    console.error('Error fetching elixir spells:', error);
  }
});

composer.callbackQuery(/^dark_spells_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerDarkSpells(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createSpellTypesKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching dark spells');
    console.error('Error fetching dark spells:', error);
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
  try {
    const playerTag = ctx.match[1];
    const player = await cocApi.getPlayer(playerTag);
    
    if (!player) {
      await ctx.answerCallbackQuery({
        text: 'Player not found',
        show_alert: true
      });
      return;
    }

    const message = playerUtils.formatPlayerInfo(player);
    const keyboard = playerUtils.createPlayerKeyboard(playerTag);

    // Check if the message content is different before editing
    const currentMessage = ctx.callbackQuery.message;
    if (currentMessage && currentMessage.text === message) {
      // If content is the same, just answer the callback query
      await ctx.answerCallbackQuery();
      return;
    }

    await ctx.editMessageText(message, {
      parse_mode: 'MarkdownV2',
      reply_markup: keyboard
    });
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Error handling back button:', error);
    await ctx.answerCallbackQuery({
      text: 'Error fetching player info',
      show_alert: true
    });
  }
});

// Add handler for Builder Base menu
composer.callbackQuery(/^builder_base_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    // Show the builder base menu with options
    await ctx.editMessageText(`*Builder Base Options for ${escapeMarkdown(player.name)}*\n\nSelect an option to view Builder Base details:`, {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBuilderBaseKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching builder base info');
    console.error('Error fetching builder base info:', error);
  }
});

// Add handler for Builder Base troops
composer.callbackQuery(/^builder_troops_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerBuilderTroops(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBuilderBaseKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching builder base troops');
    console.error('Error fetching builder base troops:', error);
  }
});

// Add handler for Builder Base heroes
composer.callbackQuery(/^builder_heroes_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    await ctx.editMessageText(playerUtils.formatPlayerBuilderHeroes(player), {
      parse_mode: 'MarkdownV2',
      reply_markup: playerUtils.createBuilderBaseKeyboard(playerTag)
    });
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching builder base heroes');
    console.error('Error fetching builder base heroes:', error);
  }
});

// Add handler for Gold Pass status
composer.callbackQuery(/^gold_pass_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    try {
      const goldPass = await cocApi.getCurrentGoldPassSeason();
      
      // Debug log to see the raw data format
      console.log('Gold Pass data:', JSON.stringify(goldPass));
      
      await ctx.editMessageText(`*🏆 Gold Pass for ${escapeMarkdown(player.name)}* \\(${escapeMarkdown(player.tag)}\\)\n\n${playerUtils.formatGoldPassStatus(goldPass)}`, {
        parse_mode: 'MarkdownV2',
        reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
      });
    } catch (goldPassError) {
      console.error('Error fetching Gold Pass information:', goldPassError);
      
      // Fallback message if Gold Pass info can't be retrieved
      await ctx.editMessageText(`*🏆 Gold Pass for ${escapeMarkdown(player.name)}* \\(${escapeMarkdown(player.tag)}\\)\n\n❌ *Gold Pass information is currently unavailable\\.*\n\nPlease check the Clash of Clans game for accurate Gold Pass details.`, {
        parse_mode: 'MarkdownV2',
        reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
      });
    }
    
    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player information');
    console.error('Error fetching player information:', error);
  }
});

export default composer; 