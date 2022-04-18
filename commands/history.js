import { SlashCommand } from '@aroleaf/djs-bot';
import db from '../lib/db.js';

export default new SlashCommand({
  name: 'history',
  description: 'View previous raids',
  options: [{
    type: 3,
    name: 'raid',
    description: 'The ID of the raid you want to view. Leave empty to view an overview of recent raids.',
  }],
  flags: [1<<1],
  permissions: {
    user: 1n<<2n,
  },
}, async interaction => {
  const reply = content => interaction.reply({ content, ephemeral: true });
  const time = t => `<t:${Math.round(t/1000)}:f>`;

  const ID = interaction.options.getString('raid');

  if (ID) {
    const raid = db.data.raids.find(raid => raid.id === ID);
    if (!raid) return reply(`Raid #${ID} not found`);
    if (raid.guild !== interaction.guildId) return reply('That raid does not belong to this guild');

    return interaction.reply({
      embeds: [{
        title: `Raid #${ID}`,
        description: `${time(raid.start)} - ${time(raid.end)}\n**${raid.ids.length}** raiders`,
      }],
      files: [{
        attachment: Buffer.from(raid.ids.join('\n'), 'utf8'),
        name: 'ids.txt',
      }],
      ephemeral: true,
    });
  }

  const recent = db.data.raids.filter(raid => raid.guild === interaction.guildId).slice(-10);
  return interaction.reply({
    embeds: [{
      title: 'Recent raids',
      description: recent.length
        ? recent.map(raid => `#\`${raid.id}\` **| ${raid.ids.length}** raiders **|** ${time(raid.start)} - ${time(raid.end)}`).join('\n')
        : 'no recent raids',
    }],
    ephemeral: true,
  });
});