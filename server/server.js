const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Sync Endpoint: Receive finished workouts from client
app.post('/api/sync', async (req, res) => {
  const { workouts, logs } = req.body;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Upsert Workouts
    for (const w of workouts) {
      await client.query(
        `INSERT INTO workouts (id, name, start_time, end_time, status) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (id) DO NOTHING`,
        [w.id, w.name, w.startTime, w.endTime, 'finished']
      );
    }

    // Upsert Logs
    for (const l of logs) {
      await client.query(
        `INSERT INTO workout_logs (id, workout_id, exercise_name, sets) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (id) DO NOTHING`,
        [l.id, l.workoutId, l.exerciseName, JSON.stringify(l.sets)]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// Get History
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.*, 
             (SELECT json_agg(l) FROM workout_logs l WHERE l.workout_id = w.id) as exercises 
      FROM workouts w 
      ORDER BY start_time DESC LIMIT 50
    `);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));