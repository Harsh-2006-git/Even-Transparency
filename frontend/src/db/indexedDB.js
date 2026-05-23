import Dexie from 'dexie';

export const db = new Dexie('EvenCargoDB');

db.version(1).stores({
  candidates: 'tempId, synced, createdAt' // Primary key and indexed props
});
