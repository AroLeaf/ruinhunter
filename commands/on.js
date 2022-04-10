import { SlashCommand } from '@aroleaf/djs-bot';
import db from '../db.js';

export default new SlashCommand({
  name: 'on',
  description: 'turn the antiraid on',
}, async interaction => {
  const reply = content => interaction.reply({ content, ephemeral: true });
  
  const settings = db.settings(interaction.guild.id);
  if (settings.active) return reply('The antiraid is already on');
  settings.active = true;
  
  await db.write();
  return reply('The antiraid has been switched on');
});