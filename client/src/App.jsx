import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ActiveWorkout from './components/ActiveWorkout';
import { db } from './db';
import { defaultExercises } from './data/exercises';

function App() {
  // Load Seed Data on first run
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
      {/* The Layout component wraps these routes to provide the 
          persistent Bottom Navigation and background styles */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workout" element={<ActiveWorkout />} />
        <Route path="/analytics" element={
          <div className="flex flex-col items-center justify-center h-64 text-gym-muted">
            <span className="text-4xl mb-2">📊</span>
            <p>Analytics Coming Soon</p>
          </div>
        } />
      </Route>
    </Routes>
  );
}

export default App;