import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { defaultExercises } from '../data/exercises';
import { v4 as uuidv4 } from 'uuid';
import { Play, Plus, Trash2, Save, History, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ActiveWorkout() {
  const navigate = useNavigate();
  // Check if there is an active workout
  const activeWorkout = useLiveQuery(() => db.workouts.where({ status: 'active' }).first());
  const activeLogs = useLiveQuery(() => activeWorkout ? db.logs.where({ workoutId: activeWorkout.id }).toArray() : []);
  
  const [selectedExercise, setSelectedExercise] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    } else if (!timerActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startWorkout = async (name) => {
    const id = uuidv4();
    await db.workouts.add({
      id,
      name: name || 'Quick Workout',
      startTime: new Date(),
      status: 'active'
    });
  };

  const finishWorkout = async () => {
    if(!activeWorkout) return;
    await db.workouts.update(activeWorkout.id, {
      status: 'finished',
      endTime: new Date(),
      synced: false // Mark for backend sync
    });
    
    // Attempt Sync
    try {
        const finishedWorkout = await db.workouts.get(activeWorkout.id);
        const logs = await db.logs.where({ workoutId: activeWorkout.id }).toArray();
        
        // Simple Sync Fetch (Replace localhost with real backend URL in production)
        await fetch(import.meta.env.VITE_API_URL + '/api/sync', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ workouts: [finishedWorkout], logs })
        });
        await db.workouts.update(activeWorkout.id, { synced: true });
    } catch(err) {
        console.log("Offline mode: saved locally");
    }
    
    navigate('/');
  };

  const addExercise = async () => {
    if (!selectedExercise) return;
    await db.logs.add({
      id: uuidv4(),
      workoutId: activeWorkout.id,
      exerciseName: selectedExercise,
      sets: [{ weight: '', reps: '', completed: false }]
    });
    setSelectedExercise('');
  };

  const updateSet = async (logId, setIndex, field, value) => {
    const log = activeLogs.find(l => l.id === logId);
    const newSets = [...log.sets];
    newSets[setIndex][field] = value;
    await db.logs.update(logId, { sets: newSets });
  };

  const addSet = async (logId) => {
    const log = activeLogs.find(l => l.id === logId);
    // Auto-fill previous weight/reps
    const lastSet = log.sets[log.sets.length - 1];
    const newSet = { weight: lastSet.weight, reps: lastSet.reps, completed: false };
    await db.logs.update(logId, { sets: [...log.sets, newSet] });
  };

  if (!activeWorkout) {
    return (
      <div className="p-4 flex flex-col gap-4 h-full justify-center">
        <h2 className="text-2xl font-bold text-center mb-8">Start Workout</h2>
        {['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full Body'].map(split => (
          <button key={split} onClick={() => startWorkout(split)} className="btn-primary bg-neutral-800 border border-neutral-700">
            {split}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-24 p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-neutral-900 z-10 py-2">
        <div>
          <h2 className="text-xl font-bold text-blue-400">{activeWorkout.name}</h2>
          <div className="flex items-center gap-2 text-sm text-neutral-400" onClick={() => setTimerActive(!timerActive)}>
             <Timer size={16} /> {formatTime(timer)}
          </div>
        </div>
        <button onClick={finishWorkout} className="bg-green-600 px-4 py-2 rounded font-bold">Finish</button>
      </div>

      <div className="flex gap-2 mb-6">
        <select 
          className="flex-1 w-full" 
          value={selectedExercise} 
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          <option value="">Select Exercise...</option>
          {defaultExercises.map(ex => (
            <option key={ex.id} value={ex.name}>{ex.name}</option>
          ))}
        </select>
        <button onClick={addExercise} className="bg-blue-600 p-2 rounded"><Plus /></button>
      </div>

      <div className="flex flex-col gap-6">
        {activeLogs?.map(log => (
          <div key={log.id} className="bg-neutral-800 p-3 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-2 border-b border-neutral-700 pb-2">
              <h3 className="font-bold text-lg">{log.exerciseName}</h3>
              <button className="text-red-400"><Trash2 size={16} /></button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs text-neutral-400 text-center mb-1">
              <span>SET</span>
              <span>KG</span>
              <span>REPS</span>
              <span>✓</span>
            </div>

            {log.sets.map((set, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2 items-center">
                <div className="text-center font-mono bg-neutral-700 rounded py-2">{index + 1}</div>
                <input 
                  type="number" 
                  placeholder="kg"
                  value={set.weight} 
                  onChange={(e) => updateSet(log.id, index, 'weight', e.target.value)}
                  className="w-full text-center"
                />
                <input 
                  type="number" 
                  placeholder="reps"
                  value={set.reps} 
                  onChange={(e) => updateSet(log.id, index, 'reps', e.target.value)}
                  className="w-full text-center"
                />
                <button 
                  onClick={() => {
                    updateSet(log.id, index, 'completed', !set.completed);
                    if(!set.completed) setTimer(0); // Reset timer on complete set
                    setTimerActive(true);
                  }}
                  className={`h-full rounded flex items-center justify-center ${set.completed ? 'bg-green-600' : 'bg-neutral-600'}`}
                >
                  <History size={16} />
                </button>
              </div>
            ))}
            
            <button onClick={() => addSet(log.id)} className="w-full bg-neutral-700 py-2 mt-2 rounded text-sm text-neutral-300">
              + Add Set
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}