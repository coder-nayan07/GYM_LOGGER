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
  
  // FORCE DB UPDATE LOGIC
  useEffect(() => {
    const init = async () => {
      const exerciseCount = await db.exercises.count();
      
      // If count doesn't match our new list length, or is 0, we reset.
      // This ensures you get the new "Smart" exercise list.
      if (exerciseCount === 0 || exerciseCount < defaultExercises.length) { 
        console.log("Database out of sync. Upgrading exercises...");
        await db.exercises.clear();
        await db.exercises.bulkAdd(defaultExercises);
        console.log("Exercises upgraded!");
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