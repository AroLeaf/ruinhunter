import { resolve } from 'path';
import { Low, JSONFile } from 'lowdb';

const db = new Low(new JSONFile(resolve('data.json')));

await db.read();

db.data ||= {
  guilds: {},
  raids: [],
}

export default db;