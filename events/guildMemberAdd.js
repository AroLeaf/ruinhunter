import { Event } from '@aroleaf/djs-bot';

export default new Event({ event: 'guildMemberAdd' }, async message => message.client.antiraid.call(message.guild.id, message.member));