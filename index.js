import { Bot } from '@aroleaf/djs-bot';

import config from './config.js';
import AntiRaid from './antiraid.js';

const client = new Bot(config);

client.login(process.env.TOKEN);

client.antiraid = new AntiRaid(client);

// https://discord.com/oauth2/authorize?client_id=927626506937720862&scope=bot%20applications.commands&permissions=1099511635974