import { SlashCommand } from '@aroleaf/djs-bot';
import db from '../db.js';

export default new SlashCommand({
  name: 'off',
  description: 'turn the antiraid off',
  permissions: {
    user: 1n<<2n,
  },
}, async interaction => {
  const reply = content => interaction.reply({ content, ephemeral: true });
  
  const settings = db.settings(interaction.guild.id);
  if (!settings.active) return reply('The antiraid is already off');
  settings.active = false;
  
  db.data[interaction.guild.id] = settings;
  await db.write();
  return reply('The antiraid has been switched off');
});