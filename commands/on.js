import { SlashCommand } from '@aroleaf/djs-bot';
import db from '../lib/db.js';

export default new SlashCommand({
  name: 'on',
  description: 'Turn the antiraid on',
  flags: [1<<1],
  permissions: {
    user: 1n<<3n,
  },
}, async interaction => {
  const reply = content => interaction.reply({ content, ephemeral: true });
  
  const settings = interaction.client.antiraid.settings(interaction.member);
  if (settings.active) return reply('The antiraid is already on');
  
  settings.active = true;
  db.data.guilds[interaction.guild.id] ||= settings;
  await db.write();
  
  return reply('The antiraid has been switched on');
});