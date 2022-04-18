import { SlashCommand } from '@aroleaf/djs-bot';
import db from '../lib/db.js';

export default new SlashCommand({
  name: 'logs',
  description: 'Change the channel I send logs to',
  options: [{
    type: 7,
    name: 'channel',
    description: 'Where to send logs',
    channel_types: [0],
  }],
  flags: [1<<1],
  permissions: {
    user: 1n<<4n,
  },
}, async interaction => {
  const channel = interaction.options.getChannel('channel');
  
  const settings = interaction.client.antiraid.settings(interaction.member);
  
  settings.logs = channel?.id;
  db.data.guilds[interaction.guild.id] ||= settings;
  await db.write();

  return interaction.reply({
    content: channel ? `I will now send logs to ${channel}` : 'I won\'t send any logs!',
    ephemeral: true,
  });
});