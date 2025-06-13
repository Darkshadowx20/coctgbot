import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import playerCallbacks from './player.js';
import clanCallbacks from './clan.js';

// Create a composer for all callbacks
const composer = new Composer<MyContext>();

// Register callback handlers
composer.use(playerCallbacks);
composer.use(clanCallbacks);

export default composer; 