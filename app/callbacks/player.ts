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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player heroes');
    console.error('Error fetching player heroes:', error);
  }
});

composer.callbackQuery(/^hero_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    // Show the hero equipment types sub-menu instead of displaying equipment directly
    await ctx.editMessageText(playerUtils.formatPlayerHeroEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createHeroEquipmentTypesKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching player hero equipment');
    console.error('Error fetching player hero equipment:', error);
  }
});

// Add handlers for individual hero equipment
composer.callbackQuery(/^barbarian_king_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(`*Select Barbarian King Equipment Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createBarbarianKingEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Barbarian King equipment');
    console.error('Error fetching Barbarian King equipment:', error);
  }
});

composer.callbackQuery(/^archer_queen_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(`*Select Archer Queen Equipment Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createArcherQueenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Archer Queen equipment');
    console.error('Error fetching Archer Queen equipment:', error);
  }
});

composer.callbackQuery(/^grand_warden_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(`*Select Grand Warden Equipment Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createGrandWardenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Grand Warden equipment');
    console.error('Error fetching Grand Warden equipment:', error);
  }
});

composer.callbackQuery(/^royal_champion_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(`*Select Royal Champion Equipment Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createRoyalChampionEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Royal Champion equipment');
    console.error('Error fetching Royal Champion equipment:', error);
  }
});

composer.callbackQuery(/^minion_prince_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(`*Select Minion Prince Equipment Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createMinionPrinceEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Minion Prince equipment');
    console.error('Error fetching Minion Prince equipment:', error);
  }
});

composer.callbackQuery(/^all_hero_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    // Get the original format function (not the menu version)
    const originalFormatFunction = async (player: any) => {
      if (!player.heroEquipment || player.heroEquipment.length === 0) {
        return 'No hero equipment data available';
      }

      // Filter home village hero equipment
      const homeVillageEquipment = player.heroEquipment.filter((equipment: any) => equipment.village === 'home');

      if (homeVillageEquipment.length === 0) {
        return 'No hero equipment data available';
      }

      // Sort equipment by name
      const sortedEquipment = [...homeVillageEquipment].sort((a: any, b: any) => a.name.localeCompare(b.name));

      // Map equipment names to emojis
      const equipmentEmojis: {[heroName: string]: {[equipmentName: string]: string}} = {
        'Barbarian King': {
          'Earthquake Boots': '👢',
          'Rage Vial': '🧪',
          'Barbarian Puppet': '🎎',
          'Giant Gauntlet': '🧤',
          'Spiky Ball': '🏐',
          'Vampstache': '🧛',
          'Snake Bracelet': '🐍',
        },
        'Archer Queen': {
          'Invisibility Vial': '👻',
          'Giant Arrow': '🏹',
          'Archer Puppet': '🎎',
          'Magic Mirror': '🪞',
          'Healer Puppet': '💖',
          'Frozen Arrow': '❄️',
          'Action Figure': '🎭',
        },
        'Grand Warden': {
          'Eternal Tome': '📖',
          'Life Gem': '💎',
          'Healing Tome': '📚',
          'Rage Gem': '💎',
          'Fireball': '🔥',
          'Lavaloon Puppet': '🎎',
          'Heroic Torch': '🔦',
        },
        'Royal Champion': {
          'Royal Gem': '💎',
          'Seeking Shield': '🛡️',
          'Hog Rider Puppet': '🐗',
          'Electro Boots': '👢',
          'Rocket Spear': '🚀',
          'Haste Vial': '🧪',
        },
        'Minion Prince': {
          'Henchmen Puppet': '🎎',
          'Dark Orb': '🔮',
          'Metal Pants': '👖',
          'Noble Iron': '⚔️',
          'Dark Crown': '👑',
        }
      };

      const equipmentList = sortedEquipment.map((equipment: any) => {
        const maxLevelIndicator = equipment.level === equipment.maxLevel ? ' ✅' : '';
        let emoji = '⚔️'; // Default emoji

        // Try to find emoji based on equipment name and hero
        for (const [heroName, equipmentMap] of Object.entries(equipmentEmojis)) {
          if (equipmentMap[equipment.name]) {
            emoji = equipmentMap[equipment.name];
            break;
          }
        }

        return `${emoji} ${escapeMarkdown(equipment.name)}: ${equipment.level}/${equipment.maxLevel}${maxLevelIndicator}`;
      }).join('\n');

      return `
*Hero Equipment for ${escapeMarkdown(player.name)}*

${equipmentList}
`.trim();
    };

    const message = await originalFormatFunction(player);

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createHeroEquipmentTypesKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching all hero equipment');
    console.error('Error fetching all hero equipment:', error);
  }
});

// Add handlers for Barbarian King equipment types
composer.callbackQuery(/^barbarian_king_normal_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerBarbarianKingNormalEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createBarbarianKingEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Normal Barbarian King equipment');
    console.error('Error fetching Normal Barbarian King equipment:', error);
  }
});

composer.callbackQuery(/^barbarian_king_legendary_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerBarbarianKingLegendaryEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createBarbarianKingEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Legendary Barbarian King equipment');
    console.error('Error fetching Legendary Barbarian King equipment:', error);
  }
});

composer.callbackQuery(/^barbarian_king_all_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerBarbarianKingEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createBarbarianKingEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching all Barbarian King equipment');
    console.error('Error fetching all Barbarian King equipment:', error);
  }
});

// Add handlers for Archer Queen equipment types
composer.callbackQuery(/^archer_queen_normal_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerArcherQueenNormalEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createArcherQueenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Normal Archer Queen equipment');
    console.error('Error fetching Normal Archer Queen equipment:', error);
  }
});

composer.callbackQuery(/^archer_queen_legendary_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerArcherQueenLegendaryEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createArcherQueenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Legendary Archer Queen equipment');
    console.error('Error fetching Legendary Archer Queen equipment:', error);
  }
});

composer.callbackQuery(/^archer_queen_all_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerArcherQueenEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createArcherQueenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching all Archer Queen equipment');
    console.error('Error fetching all Archer Queen equipment:', error);
  }
});

// Add handlers for Grand Warden equipment types
composer.callbackQuery(/^grand_warden_normal_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerGrandWardenNormalEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createGrandWardenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Normal Grand Warden equipment');
    console.error('Error fetching Normal Grand Warden equipment:', error);
  }
});

composer.callbackQuery(/^grand_warden_legendary_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerGrandWardenLegendaryEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createGrandWardenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Legendary Grand Warden equipment');
    console.error('Error fetching Legendary Grand Warden equipment:', error);
  }
});

composer.callbackQuery(/^grand_warden_all_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerGrandWardenEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createGrandWardenEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching all Grand Warden equipment');
    console.error('Error fetching all Grand Warden equipment:', error);
  }
});

// Add handlers for Royal Champion equipment types
composer.callbackQuery(/^royal_champion_normal_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerRoyalChampionNormalEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createRoyalChampionEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Normal Royal Champion equipment');
    console.error('Error fetching Normal Royal Champion equipment:', error);
  }
});

composer.callbackQuery(/^royal_champion_legendary_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerRoyalChampionLegendaryEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createRoyalChampionEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Legendary Royal Champion equipment');
    console.error('Error fetching Legendary Royal Champion equipment:', error);
  }
});

composer.callbackQuery(/^royal_champion_all_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerRoyalChampionEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createRoyalChampionEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching all Royal Champion equipment');
    console.error('Error fetching all Royal Champion equipment:', error);
  }
});

// Add handlers for Minion Prince equipment types
composer.callbackQuery(/^minion_prince_normal_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerMinionPrinceNormalEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createMinionPrinceEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Normal Minion Prince equipment');
    console.error('Error fetching Normal Minion Prince equipment:', error);
  }
});

composer.callbackQuery(/^minion_prince_legendary_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerMinionPrinceLegendaryEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createMinionPrinceEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching Legendary Minion Prince equipment');
    console.error('Error fetching Legendary Minion Prince equipment:', error);
  }
});

composer.callbackQuery(/^minion_prince_all_equipment_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];

  try {
    const player = await cocApi.getPlayer(playerTag);

    await ctx.editMessageText(playerUtils.formatPlayerMinionPrinceEquipment(player), {
      parse_mode: 'Markdown',
      reply_markup: playerUtils.createMinionPrinceEquipmentKeyboard(playerTag)
    });

    await ctx.answerCallbackQuery();
  } catch (error) {
    await ctx.answerCallbackQuery('Error fetching all Minion Prince equipment');
    console.error('Error fetching all Minion Prince equipment:', error);
  }
});

composer.callbackQuery(/^spells_(.+)$/, async (ctx) => {
  const playerTag = ctx.match[1];
    
  try {
    const player = await cocApi.getPlayer(playerTag);
    
    // Show the spell types sub-menu instead of displaying spells directly
    await ctx.editMessageText(`*Select Spell Type for ${escapeMarkdown(player.name)}*`, {
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
    
    // Debug log to see the raw builder base league data
    if (player.builderBaseLeague) {
      console.log('Builder Base League data:', JSON.stringify(player.builderBaseLeague));
    }
    
    // Show comprehensive builder base details
    await ctx.editMessageText(playerUtils.formatPlayerBuilderBaseDetails(player), {
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
      parse_mode: 'Markdown',
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
        parse_mode: 'Markdown',
        reply_markup: playerUtils.createBackToPlayerKeyboard(playerTag)
      });
    } catch (goldPassError) {
      console.error('Error fetching Gold Pass information:', goldPassError);
      
      // Fallback message if Gold Pass info can't be retrieved
      await ctx.editMessageText(`*🏆 Gold Pass for ${escapeMarkdown(player.name)}* \\(${escapeMarkdown(player.tag)}\\)\n\n❌ *Gold Pass information is currently unavailable\\.*\n\nPlease check the Clash of Clans game for accurate Gold Pass details.`, {
        parse_mode: 'Markdown',
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