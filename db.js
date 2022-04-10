import { resolve } from 'path';
import { Low, JSONFile } from 'lowdb';

const db = new Low(new JSONFile(resolve('data.json')));

await db.read();

db.data ||= {}

const def = {
  active: true,
  joins: 5,
  per: 10,
}

db.settings = id => {
  return db.data[id] || Object(def);
}

export default db;