import Dexie from 'dexie';

export const db = new Dexie('EvenCargoDB');

db.version(2).stores({
  candidates: 'tempId, synced, createdAt',
  candidatesCache: 'id, createdAt' // Cache for server-synced candidates
});
