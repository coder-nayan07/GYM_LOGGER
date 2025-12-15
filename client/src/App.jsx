import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ActiveWorkout from './components/ActiveWorkout';
import Dashboard from './components/Dashboard';
import { Home, Dumbbell, BarChart } from 'lucide-react';
import { db } from './db';
import { defaultExercises } from './data/exercises';

function App() {
  const location = useLocation();

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
    <div className="min-h-screen bg-neutral-900 text-white font-sans">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workout" element={<ActiveWorkout />} />
        {/* Add Analytics route here */}
      </Routes>

      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-neutral-900 border-t border-neutral-800 flex justify-around py-4 pb-6 z-50">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-500' : 'text-neutral-500'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/workout" className={`flex flex-col items-center ${location.pathname === '/workout' ? 'text-blue-500' : 'text-neutral-500'}`}>
          <div className="bg-blue-600 rounded-full p-3 -mt-8 border-4 border-neutral-900 shadow-lg text-white">
            <Dumbbell size={24} />
          </div>
        </Link>
        <Link to="/" className="flex flex-col items-center text-neutral-500">
          <BarChart size={24} />
          <span className="text-xs mt-1">Stats</span>
        </Link>
      </nav>
    </div>
  );
}

export default App;