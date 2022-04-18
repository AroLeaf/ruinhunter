// @ts-check
import { Collection } from '@aroleaf/djs-bot';
import snowflake from './snowflakes.js';

export default class AntiRaid {
  constructor(client, settings) {
    this.client = client;
    this.settings = settings;
    this.raids = new Collection();
    this.cache = new Collection();

    client.on('guildMemberAdd', this.onGuildMemberAdd.bind(this));
    // client.on('messageCreate', msg => msg.author.id === '659488296820408355' && this.onGuildMemberAdd(msg.member));
  }


  limitTemplate(settings) {
    return {
      left: settings.joins,
      reset: Date.now() + settings.per,
      joins: [],
    }
  }

  raidTemplate(guildId) {
    return {
      id: snowflake(),
      guild: guildId,
      start: Date.now(),
      end: 0,
      timeout: 0,
      ids: [],
    }
  }

  limit(member) {
    const limit = this.cache.get(member.guild.id) || this.limitTemplate(this.settings(member));
    if (!this.cache.get(member.guild.id)) this.cache.set(member.guild.id, limit);
    return limit;
  }


  onGuildMemberAdd(member) {
    const settings = this.settings(member);
    if (settings.age && member.user.createdTimestamp + settings.age < Date.now()) return;
    
    const limit = this.limit(member);

    if (limit.reset < Date.now()) return this.reset(member);
    if (this.raids.has(member.guild.id)) return this.raider(member);
    if (limit.left <= 0) return this.raid(member);

    limit.left--;
    limit.joins.push(member);
  }

  reset(member) {
    this.cache.delete(member.guild.id);
    if (this.raids.has(member.guild.id)) this.raidEnd(member);
    return this.onGuildMemberAdd(member);
  }

  raid(member) {
    const raid = this.raidTemplate(member.guild.id);
    this.raids.set(member.guild.id, raid);
    this.client.emit('raidStart', raid);
    this.limit(member).joins.forEach(member => this.raider(member));
    this.raider(member);
  }

  raider(member) {
    const settings = this.settings(member);
    this.limit(member).reset = Date.now() + settings.per;
    const raid = this.raids.get(member.guild.id);
    raid.ids.push(member.id);
    clearTimeout(raid.timeout);
    raid.timeout = setTimeout(() => this.raidEnd(member), settings.per);
    this.client.emit('raidMember', member);
  }

  raidEnd(member) {
    const raid = this.raids.get(member.guild.id);
    if (raid) {
      this.raids.delete(member.guild.id);
      raid.end = Date.now();
      delete raid.timeout;
      this.client.emit('raidEnd', raid);
    }
  }
}