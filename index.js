import { Bot } from '@aroleaf/djs-bot';

import config from './config.js';
import AntiRaid from './lib/antiraid.js';
import { intervals } from './lib/contants.js';
import db from './lib/db.js';

const client = new Bot(config);

client.antiraid = new AntiRaid(
  client,
  member => (db.data.guilds[member.guild.id] || {
    active: true,
    age: 4 * intervals.WEEK,
    joins: 5,
    per: 10 * intervals.SECOND,
  }),
);


function log(guildId, data) {
  client.channels.resolve(db.data.guilds[guildId]?.logs)?.send(data);
}


client.on('raidStart', async raid => {
  log(raid.guild, { embeds: [{
    title: 'Detected a raid!',
    footer: { text: `raid ID: ${raid.id}` },
    timestamp: raid.start,
    color: 0xf04747,
  }] });
});

client.on('raidEnd', async raid => {
  const time = t => `<t:${Math.round(t/1000)}:R>`;
  log(raid.guild, {
    embeds: [{
      title: 'Raid over!',
      description: `${time(raid.start)} - ${time(raid.end)}\n**${raid.ids.length}** raiders`,
      footer: { text: `raid ID: ${raid.id}` },
      timestamp: raid.end,
      color: 0x43b581,
    }],
    files: [{
      attachment: Buffer.from(raid.ids.join('\n'), 'utf8'),
      name: 'ids.txt',
    }],
  });
  db.data.raids.push(raid);
  await db.write();
});

client.on('raidMember', member => {
  // console.log('ban', member.id);
  member.ban().catch(() => log(member.guild.id, { embeds: [{
    title: `⚠️ Couldn\'t ban ${member.user.tag}`,
    description: `user ID: ${member.id}`,
    footer: { text: `raid ID: ${raid.id}` },
    color: 0xf04747,
  }] }));
});

client.login(process.env.TOKEN);