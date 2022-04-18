import { SlashCommand } from '@aroleaf/djs-bot';
import db from '../lib/db.js';

export default new SlashCommand({
  name: 'stats',
  description: 'stats',
}, interaction => {
  interaction.reply({
    content: `**${interaction.client.guilds.cache.size.toLocaleString()}** guilds **|** **${interaction.client.guilds.cache.reduce((a, v) => a + v.memberCount, 0).toLocaleString()}** members\n**${db.data.raids.length.toLocaleString()}** raids **|** ${db.data.raids.reduce((a,v) => a + v.ids.length, 0)} raiders`,
    ephemeral: true,
  })
});