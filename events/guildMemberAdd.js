import { Event } from '@aroleaf/djs-bot';

export default new Event({ event: 'messageCreate' }, async message => message.channel.id === '955866348913852467' && message.client.antiraid.call(message.guild.id, message.member));