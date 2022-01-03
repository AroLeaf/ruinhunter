import { Module } from '@ruinguard/core';
import essentials from '@ruinguard/essentials';
import automod from '@ruinguard/automod';
import { config } from 'dotenv';
config();

const modules = process.argv.includes('--empty') 
  ? []
  : [essentials, automod({ disable: ['filter'] })];

const options = {
  app: process.env.CLIENTID,
  token: process.env.TOKEN,
  guild: process.env.GUILDID,
};

console.log(process.argv.includes('--global'));

await process.argv.includes('--global')
  ? Module.registerGlobalCommands(modules, options)
  : Module.registerGuildCommands(modules, options);