import { Event } from '@aroleaf/djs-bot';

export default new Event({ event: 'guildMemberAdd' }, async member => member.client.antiraid.call(member.guild.id, member));