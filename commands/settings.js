import { SlashCommand } from '@aroleaf/djs-bot';
import db from '../db.js';

export default new SlashCommand({
  name: 'settings',
  description: 'change the trigger threshold for a raid',
  options: [{
    type: 4,
    name: 'joins',
    description: 'how many people may join within a certain time frame',
    min_value: 1,
    required: true,
  }, {
    type: 4,
    name: 'per',
    description: 'how long one time frame is, in seconds',
    min_value: 1,
    required: true,
  }],
}, async interaction => {
  const [joins, per] = ['joins', 'per'].map(p => interaction.options.getInteger(p));
  
  const settings = db.settings(interaction.guild.id);
  settings.joins = joins;
  settings.per = per;
  
  db.data[interaction.guild.id] = settings;
  await db.write();

  return interaction.reply({
    content: `A raid is now triggered when ${joins} users join in ${per} seconds`,
    ephemeral: true,
  });
});