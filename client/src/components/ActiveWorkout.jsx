import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Timer, Check, MoreVertical, Plus, Trash2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExerciseSelector from './ExerciseSelector';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const activeWorkout = useLiveQuery(() => db.workouts.where({ status: 'active' }).first());
  const activeLogs = useLiveQuery(() => activeWorkout ? db.logs.where({ workoutId: activeWorkout.id }).toArray() : []);
  
  const [elapsed, setElapsed] = useState(0);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [restTimer, setRestTimer] = useState(null); // Tracks the start time of rest

  // Global Workout Timer
  useEffect(() => {
    if(!activeWorkout) return;
    const interval = setInterval(() => {
        const start = new Date(activeWorkout.startTime);
        const now = new Date();
        setElapsed(Math.floor((now - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

  // Helper to format time
  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h ? h+':' : ''}${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
  };

  const finishWorkout = async () => {
    if(!activeWorkout) return;
    await db.workouts.update(activeWorkout.id, {
      status: 'finished',
      endTime: new Date(),
      synced: false
    });
    navigate('/');
  };

  const handleAddExercise = async (name) => {
    await db.logs.add({
      id: uuidv4(),
      workoutId: activeWorkout.id,
      exerciseName: name,
      sets: [{ weight: '', reps: '', completed: false }]
    });
  };

  // Optimized Set Update - Auto-saves to DB
  const updateSet = (logId, setIndex, field, value) => {
    const log = activeLogs.find(l => l.id === logId);
    const newSets = [...log.sets];
    newSets[setIndex][field] = value;
    db.logs.update(logId, { sets: newSets });
  };

  const toggleSetComplete = (logId, setIndex) => {
    const log = activeLogs.find(l => l.id === logId);
    const newSets = [...log.sets];
    newSets[setIndex].completed = !newSets[setIndex].completed;
    
    // Trigger Rest Timer logic here if completed
    if(newSets[setIndex].completed) {
        setRestTimer(Date.now()); 
    }
    
    db.logs.update(logId, { sets: newSets });
  };

  const addSet = async (logId) => {
    const log = activeLogs.find(l => l.id === logId);
    const lastSet = log.sets[log.sets.length - 1] || { weight: '', reps: '' };
    // Auto-copy previous data for speed
    const newSet = { weight: lastSet.weight, reps: lastSet.reps, completed: false };
    await db.logs.update(logId, { sets: [...log.sets, newSet] });
  };

  if (!activeWorkout) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="pb-32">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 bg-gym-bg/95 backdrop-blur z-40 py-4 border-b border-gym-input flex justify-between items-center mb-6">
        <div>
           <h2 className="font-bold text-white leading-tight">{activeWorkout.name}</h2>
           <div className="text-gym-accent flex items-center gap-1 text-sm font-mono">
             <Timer size={14} /> {formatTime(elapsed)}
           </div>
        </div>
        <button 
          onClick={finishWorkout} 
          className="bg-gym-success text-black font-bold px-4 py-2 rounded-lg text-sm active:scale-95 transition-transform"
        >
          Finish
        </button>
      </div>

      {/* Exercise List */}
      <div className="space-y-6">
        {activeLogs?.map(log => (
          <div key={log.id} className="bg-gym-card rounded-2xl overflow-hidden border border-gym-input shadow-md">
            {/* Exercise Header */}
            <div className="p-4 bg-gym-input/50 flex justify-between items-center border-b border-gym-input">
              <h3 className="font-bold text-white text-lg">{log.exerciseName}</h3>
              <button className="text-gym-muted hover:text-white"><MoreVertical size={20} /></button>
            </div>

            {/* Sets Header */}
            <div className="grid grid-cols-10 gap-2 p-2 text-xs text-gym-muted font-bold text-center uppercase tracking-wider">
              <div className="col-span-1">Set</div>
              <div className="col-span-2">Prev</div>
              <div className="col-span-3">kg</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-1">✓</div>
            </div>

            {/* Sets Rows */}
            <div className="p-2 space-y-2">
              {log.sets.map((set, index) => (
                <div 
                   key={index} 
                   className={`grid grid-cols-10 gap-2 items-center transition-opacity ${set.completed ? 'opacity-50' : 'opacity-100'}`}
                >
                  {/* Set Number */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="w-6 h-6 rounded-full bg-gym-input text-gym-muted text-xs flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                  </div>

                  {/* Previous Data (Mocked for now) */}
                  <div className="col-span-2 text-center text-gym-muted text-xs font-mono">
                    -
                  </div>

                  {/* Weight Input */}
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      inputMode="decimal"
                      value={set.weight} 
                      onChange={(e) => updateSet(log.id, index, 'weight', e.target.value)}
                      placeholder="0"
                      className={`w-full bg-gym-input text-center text-white font-bold py-3 rounded-lg border-2 ${set.completed ? 'border-transparent' : 'border-transparent focus:border-gym-accent'} outline-none`}
                    />
                  </div>

                  {/* Reps Input */}
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      inputMode="decimal"
                      value={set.reps} 
                      onChange={(e) => updateSet(log.id, index, 'reps', e.target.value)}
                      placeholder="0"
                      className={`w-full bg-gym-input text-center text-white font-bold py-3 rounded-lg border-2 ${set.completed ? 'border-transparent' : 'border-transparent focus:border-gym-accent'} outline-none`}
                    />
                  </div>

                  {/* Check Button */}
                  <div className="col-span-1 flex justify-center">
                    <button 
                      onClick={() => toggleSetComplete(log.id, index)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        set.completed ? 'bg-gym-success text-black' : 'bg-gym-input text-gym-muted'
                      }`}
                    >
                      <Check size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Set Button */}
            <button 
              onClick={() => addSet(log.id)}
              className="w-full py-3 bg-gym-input/30 text-gym-accent font-semibold text-sm hover:bg-gym-input/50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Set
            </button>
          </div>
        ))}
      </div>

      {/* Add Exercise Floating Button (Bottom of list) */}
      <button 
        onClick={() => setIsSelectorOpen(true)}
        className="w-full mt-6 py-4 border-2 border-dashed border-gym-input rounded-xl text-gym-muted hover:text-white hover:border-gym-accent transition-colors flex items-center justify-center gap-2 font-bold"
      >
        <Plus size={20} /> Add Exercise
      </button>

      {/* Exercise Modal - NOW PASSING activeWorkout.name as context */}
      <ExerciseSelector 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)} 
        onSelect={handleAddExercise}
        context={activeWorkout.name} 
      />

      {/* Rest Timer Toast (Optional Polish) */}
      {restTimer && (
        <div className="fixed bottom-24 right-4 bg-gym-card border border-gym-accent text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-mono animate-bounce">
            <Clock size={16} className="text-gym-accent"/> Rest Started
        </div>
      )}
    </div>
  );
}