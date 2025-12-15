import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Timer, Check, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExerciseSelector from './ExerciseSelector';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  
  // 1. Fetch Data safely
  const activeWorkout = useLiveQuery(() => db.workouts.where({ status: 'active' }).first());
  const activeLogs = useLiveQuery(() => activeWorkout ? db.logs.where({ workoutId: activeWorkout.id }).toArray() : []);
  
  const [elapsed, setElapsed] = useState(0);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // 2. Redirect if no workout exists (Fixes blank screen)
  useEffect(() => {
    const checkStatus = async () => {
      // Small delay to let DB load
      await new Promise(r => setTimeout(r, 100)); 
      const count = await db.workouts.where({ status: 'active' }).count();
      if (count === 0) {
        navigate('/'); 
      }
    };
    checkStatus();
  }, [navigate]);

  // 3. Timer
  useEffect(() => {
    if(!activeWorkout) return;
    const interval = setInterval(() => {
        const start = new Date(activeWorkout.startTime);
        const now = new Date();
        setElapsed(Math.floor((now - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeWorkout]);

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

  // --- LOGIC FIXES START HERE ---

  // 4. SMART ADD: Groups sets under one exercise
  const handleAddExercise = async (name) => {
    if (!activeWorkout) return;

    // Check if this exercise is already in the list
    const existingLog = activeLogs.find(l => l.exerciseName === name);

    if (existingLog) {
      // If exists, just add a set to it!
      addSet(existingLog.id);
    } else {
      // If new, create a new card
      await db.logs.add({
        id: uuidv4(),
        workoutId: activeWorkout.id,
        exerciseName: name,
        sets: [{ weight: '', reps: '', completed: false }]
      });
    }
  };

  // 5. INPUT HANDLER: Debounced or direct update
  const updateSet = (logId, setIndex, field, value) => {
    // We update Dexie directly. Dexie is fast enough that the UI should keep up.
    // If typing is laggy, we would use local state, but for < 50 items this is fine.
    const log = activeLogs.find(l => l.id === logId);
    if (!log) return;

    const newSets = [...log.sets];
    newSets[setIndex][field] = value;
    
    db.logs.update(logId, { sets: newSets });
  };

  // 6. TOGGLE COMPLETE
  const toggleSetComplete = (logId, setIndex) => {
    const log = activeLogs.find(l => l.id === logId);
    if (!log) return;

    const newSets = [...log.sets];
    newSets[setIndex].completed = !newSets[setIndex].completed;
    db.logs.update(logId, { sets: newSets });
  };

  // 7. ADD SET (With Auto-Copy)
  const addSet = async (logId) => {
    const log = activeLogs.find(l => l.id === logId);
    if (!log) return;

    // Copy weight/reps from previous set for convenience
    const lastSet = log.sets[log.sets.length - 1] || { weight: '', reps: '' };
    const newSet = { weight: lastSet.weight, reps: lastSet.reps, completed: false };
    
    await db.logs.update(logId, { sets: [...log.sets, newSet] });
  };

  // 8. DELETE EXERCISE
  const deleteLog = async (logId) => {
    if(window.confirm("Remove this exercise?")) {
      await db.logs.delete(logId);
    }
  };

  // 9. DELETE SINGLE SET
  const deleteSet = async (logId, setIndex) => {
    const log = activeLogs.find(l => l.id === logId);
    if (!log) return;
    
    const newSets = log.sets.filter((_, i) => i !== setIndex);
    if (newSets.length === 0) {
        // If no sets left, delete the log
        await db.logs.delete(logId);
    } else {
        await db.logs.update(logId, { sets: newSets });
    }
  };

  if (!activeWorkout) return null;

  return (
    <div className="pb-32">
      {/* Top Bar */}
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

      {/* Exercises List */}
      <div className="space-y-6">
        {activeLogs?.map(log => (
          <div key={log.id} className="bg-gym-card rounded-2xl overflow-hidden border border-gym-input shadow-md animate-fade-in">
            {/* Header */}
            <div className="p-4 bg-gym-input/50 flex justify-between items-center border-b border-gym-input">
              <h3 className="font-bold text-white text-lg">{log.exerciseName}</h3>
              <button 
                onClick={() => deleteLog(log.id)}
                className="text-gym-muted hover:text-gym-danger p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-10 gap-2 p-2 text-xs text-gym-muted font-bold text-center uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-3">kg</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-1">✓</div>
            </div>

            {/* Sets Rows */}
            <div className="p-2 space-y-2">
              {log.sets.map((set, index) => (
                <div key={index} className={`grid grid-cols-10 gap-2 items-center ${set.completed ? 'opacity-50' : ''}`}>
                  
                  {/* Set Number (Click to delete set) */}
                  <button 
                    onClick={() => deleteSet(log.id, index)}
                    className="col-span-1 text-center font-mono text-gym-muted text-xs hover:text-red-500"
                  >
                    {index + 1}
                  </button>
                  
                  {/* Weight Input */}
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      inputMode="decimal" // Pops up numeric keypad on mobile
                      placeholder="-"
                      value={set.weight} 
                      onChange={(e) => updateSet(log.id, index, 'weight', e.target.value)}
                      className="w-full bg-gym-input text-center text-white py-3 rounded-lg font-bold outline-none focus:ring-1 focus:ring-gym-accent border border-transparent focus:border-gym-accent transition-all"
                    />
                  </div>

                  {/* Reps Input */}
                  <div className="col-span-3">
                    <input 
                      type="number" 
                      inputMode="decimal"
                      placeholder="-"
                      value={set.reps} 
                      onChange={(e) => updateSet(log.id, index, 'reps', e.target.value)}
                      className="w-full bg-gym-input text-center text-white py-3 rounded-lg font-bold outline-none focus:ring-1 focus:ring-gym-accent border border-transparent focus:border-gym-accent transition-all"
                    />
                  </div>

                  {/* Check Button */}
                  <div className="col-span-1 flex justify-center">
                    <button 
                      onClick={() => toggleSetComplete(log.id, index)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        set.completed ? 'bg-gym-success text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-gym-input text-gym-muted'
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
                className="w-full py-3 bg-gym-input/30 text-gym-accent font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gym-input/50 transition-colors"
            >
              <Plus size={16} /> Add Set
            </button>
          </div>
        ))}
      </div>

      {/* Add Exercise Button */}
      <button 
        onClick={() => setIsSelectorOpen(true)}
        className="w-full mt-6 py-4 border-2 border-dashed border-gym-input rounded-xl text-gym-muted hover:text-white hover:border-gym-accent transition-colors flex items-center justify-center gap-2 font-bold"
      >
        <Plus size={20} /> Add Exercise
      </button>

      <ExerciseSelector 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)} 
        onSelect={handleAddExercise}
        context={activeWorkout.name} 
      />
    </div>
  );
}