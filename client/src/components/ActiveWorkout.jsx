import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { Timer, Check, MoreVertical, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExerciseSelector from './ExerciseSelector';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const activeWorkout = useLiveQuery(() => db.workouts.where({ status: 'active' }).first());
  const activeLogs = useLiveQuery(() => activeWorkout ? db.logs.where({ workoutId: activeWorkout.id }).toArray() : []);
  
  const [elapsed, setElapsed] = useState(0);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Timer Logic
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

  const handleAddExercise = async (name) => {
    await db.logs.add({
      id: uuidv4(),
      workoutId: activeWorkout.id,
      exerciseName: name,
      sets: [{ weight: '', reps: '', completed: false }]
    });
  };

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
    db.logs.update(logId, { sets: newSets });
  };

  const addSet = async (logId) => {
    const log = activeLogs.find(l => l.id === logId);
    const lastSet = log.sets[log.sets.length - 1] || { weight: '', reps: '' };
    const newSet = { weight: lastSet.weight, reps: lastSet.reps, completed: false };
    await db.logs.update(logId, { sets: [...log.sets, newSet] });
  };

  if (!activeWorkout) return <div className="p-10 text-center text-white">Loading workout...</div>;

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

      {/* Exercises */}
      <div className="space-y-6">
        {activeLogs?.map(log => (
          <div key={log.id} className="bg-gym-card rounded-2xl overflow-hidden border border-gym-input shadow-md">
            <div className="p-4 bg-gym-input/50 flex justify-between items-center border-b border-gym-input">
              <h3 className="font-bold text-white text-lg">{log.exerciseName}</h3>
              <button className="text-gym-muted hover:text-white"><MoreVertical size={20} /></button>
            </div>

            <div className="grid grid-cols-10 gap-2 p-2 text-xs text-gym-muted font-bold text-center uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-2">Prev</div>
              <div className="col-span-3">kg</div>
              <div className="col-span-3">Reps</div>
              <div className="col-span-1">✓</div>
            </div>

            <div className="p-2 space-y-2">
              {log.sets.map((set, index) => (
                <div key={index} className={`grid grid-cols-10 gap-2 items-center ${set.completed ? 'opacity-50' : ''}`}>
                  <div className="col-span-1 text-center font-mono text-gym-muted">{index + 1}</div>
                  <div className="col-span-2 text-center text-gym-muted text-xs">-</div>
                  <div className="col-span-3">
                    <input 
                      type="number" inputMode="decimal" placeholder="0"
                      value={set.weight} onChange={(e) => updateSet(log.id, index, 'weight', e.target.value)}
                      className="w-full bg-gym-input text-center text-white py-3 rounded-lg font-bold outline-none focus:ring-1 focus:ring-gym-accent"
                    />
                  </div>
                  <div className="col-span-3">
                    <input 
                      type="number" inputMode="decimal" placeholder="0"
                      value={set.reps} onChange={(e) => updateSet(log.id, index, 'reps', e.target.value)}
                      className="w-full bg-gym-input text-center text-white py-3 rounded-lg font-bold outline-none focus:ring-1 focus:ring-gym-accent"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button 
                      onClick={() => toggleSetComplete(log.id, index)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${set.completed ? 'bg-gym-success text-black' : 'bg-gym-input text-gym-muted'}`}
                    >
                      <Check size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => addSet(log.id)} className="w-full py-3 bg-gym-input/30 text-gym-accent font-semibold text-sm flex items-center justify-center gap-2">
              <Plus size={16} /> Add Set
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setIsSelectorOpen(true)}
        className="w-full mt-6 py-4 border-2 border-dashed border-gym-input rounded-xl text-gym-muted hover:text-white hover:border-gym-accent transition-colors flex items-center justify-center gap-2 font-bold"
      >
        <Plus size={20} /> Add Exercise
      </button>

      {/* MODAL IS HERE - PASSING THE CONTEXT */}
      <ExerciseSelector 
        isOpen={isSelectorOpen} 
        onClose={() => setIsSelectorOpen(false)} 
        onSelect={handleAddExercise}
        context={activeWorkout.name} 
      />
    </div>
  );
}