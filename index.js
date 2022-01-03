import { Bot } from '@ruinguard/core';
import essentials from '@ruinguard/essentials';
import automod from '@ruinguard/automod';
import { config } from 'dotenv';
config();

// https://discord.com/oauth2/authorize?client_id=927626506937720862&scope=bot%20applications.commands&permissions=1099511635974

const client = new Bot({
  owner: '659488296820408355',
  modules: [essentials, automod({ disable: ['filter'] })],
});

await client.login(process.env.TOKEN);