import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ActiveWorkout from './components/ActiveWorkout';
import Analytics from './components/Analytics';
import WorkoutDetails from './components/WorkoutDetails';
import Settings from './components/Settings';
import { db } from './db';
import { defaultExercises } from './data/exercises';

function App() {
  
  // This logic now CHECKS and UPDATES your exercise list automatically
  useEffect(() => {
    const init = async () => {
      const exerciseCount = await db.exercises.count();
      
      // If we have very few exercises (old data), or none, let's reload the full database
      if (exerciseCount < 10) { 
        console.log("Upgrading Exercise Database...");
        await db.exercises.clear();
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
        <Route path="/history/:id" element={<WorkoutDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;