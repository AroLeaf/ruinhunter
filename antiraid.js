import { Collection } from '@aroleaf/djs-bot';
import db from './db.js';

export default class AntiRaid {
  constructor(client) {
    this.client = client;
    this.cache = new Collection();
  }


  get(id) {
    const settings = db.settings(id);
    return this.cache.ensure(id, () => ({
      left: settings.joins,
      reset: Date.now() + settings.per*1000,
      joins: [],
    }));
  }


  check(id) {
    const limit = this.get(id);
    return limit.left <= 0 && limit.reset >= Date.now();
  }


  call(id, member) {
    if (!db.settings(id).active) return false;
    const limit = this.get(id);

    if (limit.reset < Date.now()) return this.reset(id, member);
    if (limit.left <= 0) return this.raid(id, member);
    return this.add(id, member);
  }

  add(id, member) {
    const limit = this.get(id);
    limit.left--;
    limit.joins.push(member);
    return this.check(id);
  }


  reset(id, member) {
    this.cache.delete(id);
    return this.call(id, member);
  }


  raid(id, member) {
    const limit = this.get(id);
    limit.reset = Date.now() + db.settings(id).per*1000;
    for (const join of limit.joins.concat(member)) {
      join.ban({ reason: 'Ruinhunter antiraid' }).catch(() => {});
    }
    limit.joins.length = 0;
  }
}