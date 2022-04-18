import { loader } from '@aroleaf/djs-bot';
import 'dotenv/config';

const commands = await loader('commands');

const config = {
  intents: [1<<0, 1<<1, 1<<9],
  owner: '659488296820408355',
  commands,
  presence: {
    status: 'online',
    activities: [{
      name: 'people join',
      type: 'WATCHING',
    }],
  },
}

export { commands, config as default };