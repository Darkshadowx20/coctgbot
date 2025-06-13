import { Composer } from 'grammy';
import { MyContext } from '../types/bot.js';
import playerCommand from './player.js';
import clanCommand from './clan.js';
import userCommand from './user.js';
import commonCommand from './common.js';

// Create a composer to combine all commands
const composer = new Composer<MyContext>();

// Register all commands
composer.use(playerCommand);
composer.use(clanCommand);
composer.use(userCommand);
composer.use(commonCommand);

export default composer; 