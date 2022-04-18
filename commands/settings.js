import { SlashCommand } from '@aroleaf/djs-bot';
import { intervals } from '../lib/contants.js';
import db from '../lib/db.js';

export default new SlashCommand({
  name: 'settings',
  description: 'Change the trigger threshold for a raid',
  options: [{
    type: 4,
    name: 'joins',
    description: 'How many people may join within a certain time frame',
    min_value: 1,
    required: true,
  }, {
    type: 4,
    name: 'per',
    description: 'in seconds. How long one time frame is.',
    min_value: 1,
    required: true,
  }, {
    type: 4,
    name: 'max-age',
    description: 'in days, 0 to turn off. Accounts older than this won\'t get counted towards raids',
    min_value: 0,
    required: true,
  }],
  flags: [1<<1],
  permissions: {
    user: 1n<<3n,
  },
}, async interaction => {
  const [joins, per, age] = ['joins', 'per', 'age'].map(p => interaction.options.getInteger(p));
  
  const settings = interaction.client.antiraid.settings(interaction.member);
  
  settings.joins = joins;
  settings.per = per * intervals.SECOND;
  settings.age = age * intervals.DAY;
  db.data.guilds[interaction.guild.id] ||= settings;
  await db.write();

  return interaction.reply({
    content: age 
      ? `A raid is now triggered when ${joins} users younger than ${age} days join in ${per} seconds`
      : `A raid is now triggered when ${joins} users join in ${per} seconds`,
    ephemeral: true,
  });
});