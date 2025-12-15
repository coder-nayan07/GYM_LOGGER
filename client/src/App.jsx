import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ActiveWorkout from './components/ActiveWorkout';
import Analytics from './components/Analytics';
import WorkoutDetails from './components/WorkoutDetails';
import { db } from './db';
import { defaultExercises } from './data/exercises';
import Settings from './components/Settings';

function App() {
  useEffect(() => {
    const init = async () => {
      const count = await db.exercises.count();
      if (count === 0) {
        await db.exercises.bulkAdd(defaultExercises);
      }
    };
    init();
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workout" element={<ActiveWorkout />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* New Route for Details */}
        <Route path="/history/:id" element={<WorkoutDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;