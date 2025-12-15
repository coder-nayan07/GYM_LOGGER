import Dexie from 'dexie';

export const db = new Dexie('IronLogDB');

// Schema definition
db.version(1).stores({
  exercises: '++id, name, bodyPart', 
  workouts: 'id, date, status', // status: 'active' or 'finished'
  logs: 'id, workoutId, exerciseName', // logs contain the sets
});