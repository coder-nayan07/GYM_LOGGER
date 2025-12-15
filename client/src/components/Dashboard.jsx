import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Flame, Dumbbell, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {
  const navigate = useNavigate();
  const activeWorkout = useLiveQuery(() => db.workouts.where({ status: 'active' }).first());
  const history = useLiveQuery(() => 
    db.workouts.where('status').equals('finished').reverse().limit(5).toArray()
  );

  const startWorkout = async (name) => {
    // If user clicks "Custom", ask for name
    let finalName = name;
    if (name === 'Custom') {
      const input = window.prompt("Name your workout (e.g., 'Chest & Back'):");
      if (!input) return; // Cancelled
      finalName = input;
    }

    if (activeWorkout) return navigate('/workout');
    
    await db.workouts.add({
      id: uuidv4(),
      name: finalName,
      startTime: new Date(),
      status: 'active'
    });
    navigate('/workout');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-gym-muted text-sm uppercase tracking-wider font-semibold">Welcome Back</h2>
          <h1 className="text-3xl font-bold text-white">Let's Crush It</h1>
        </div>
        <div className="flex items-center gap-1 bg-gym-card px-3 py-1 rounded-full border border-gym-input">
          <Flame size={16} className="text-orange-500 fill-orange-500" />
          <span className="font-bold text-sm">3 Day Streak</span>
        </div>
      </header>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {activeWorkout ? (
           <button 
             onClick={() => navigate('/workout')}
             className="col-span-2 bg-gradient-to-r from-gym-accent to-blue-600 rounded-2xl p-6 text-left shadow-lg relative overflow-hidden"
           >
             <div className="relative z-10">
               <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">RESUME</span>
               <h3 className="text-xl font-bold text-white mb-1">{activeWorkout.name}</h3>
               <p className="text-blue-100 text-sm">Workout in progress...</p>
             </div>
           </button>
        ) : (
          <>
            {/* Standard Splits */}
            <button onClick={() => startWorkout('Push Day')} className="bg-gym-card p-4 rounded-2xl text-left border border-gym-input active:scale-95 transition-transform">
              <span className="font-bold text-lg block text-white">Push</span>
              <span className="text-xs text-gym-muted">Chest/Sh/Tri</span>
            </button>
            <button onClick={() => startWorkout('Pull Day')} className="bg-gym-card p-4 rounded-2xl text-left border border-gym-input active:scale-95 transition-transform">
              <span className="font-bold text-lg block text-white">Pull</span>
              <span className="text-xs text-gym-muted">Back/Bi</span>
            </button>
            <button onClick={() => startWorkout('Leg Day')} className="bg-gym-card p-4 rounded-2xl text-left border border-gym-input active:scale-95 transition-transform">
              <span className="font-bold text-lg block text-white">Legs</span>
              <span className="text-xs text-gym-muted">Quads/Hams</span>
            </button>
            
            {/* Custom Button */}
            <button onClick={() => startWorkout('Custom')} className="bg-gym-card p-4 rounded-2xl text-left border border-dashed border-gym-muted active:scale-95 transition-transform flex flex-col justify-center items-center">
              <Plus className="text-gym-accent mb-1" />
              <span className="font-bold text-white">Custom</span>
            </button>
          </>
        )}
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Recent History</h3>
        </div>
        <div className="space-y-3">
          {history?.map(workout => (
            <div 
              key={workout.id} 
              onClick={() => navigate(`/history/${workout.id}`)}
              className="bg-gym-card p-4 rounded-xl border border-gym-input flex justify-between items-center cursor-pointer active:bg-gym-input"
            >
              <div>
                <h4 className="font-bold text-white">{workout.name}</h4>
                <p className="text-xs text-gym-muted">{new Date(workout.startTime).toLocaleDateString()}</p>
              </div>
              <ChevronRight className="text-gym-input" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}