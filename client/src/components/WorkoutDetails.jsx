import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db';
import { ArrowLeft, Calendar, Clock, Dumbbell } from 'lucide-react';

export default function WorkoutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const w = await db.workouts.get(id);
      const l = await db.logs.where({ workoutId: id }).toArray();
      setWorkout(w);
      setLogs(l);
    };
    fetchData();
  }, [id]);

  if (!workout) return <div className="p-8 text-center text-gym-muted">Loading...</div>;

  const duration = Math.round((new Date(workout.endTime) - new Date(workout.startTime)) / 1000 / 60);

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gym-card rounded-full border border-gym-input text-white">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-white">{workout.name}</h1>
            <p className="text-xs text-gym-muted">{new Date(workout.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="flex gap-4 overflow-x-auto pb-2">
         <div className="bg-gym-card px-4 py-2 rounded-lg border border-gym-input flex items-center gap-2 whitespace-nowrap">
            <Clock size={16} className="text-gym-accent" />
            <span className="font-bold text-white">{duration} min</span>
         </div>
         <div className="bg-gym-card px-4 py-2 rounded-lg border border-gym-input flex items-center gap-2 whitespace-nowrap">
            <Dumbbell size={16} className="text-emerald-500" />
            <span className="font-bold text-white">{logs.length} Exercises</span>
         </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {logs.map(log => (
            <div key={log.id} className="bg-gym-card rounded-xl overflow-hidden border border-gym-input">
                <div className="p-3 bg-gym-input/20 border-b border-gym-input">
                    <h3 className="font-bold text-white">{log.exerciseName}</h3>
                </div>
                <div className="p-3">
                    <div className="grid grid-cols-3 text-xs text-gym-muted uppercase font-bold mb-2 text-center">
                        <span>Set</span>
                        <span>kg</span>
                        <span>Reps</span>
                    </div>
                    {log.sets.map((set, i) => (
                        <div key={i} className="grid grid-cols-3 text-center py-2 border-b border-gym-input/30 last:border-0 text-sm">
                            <span className="text-gym-muted font-mono">{i + 1}</span>
                            <span className="text-white font-bold">{set.weight}</span>
                            <span className="text-white font-bold">{set.reps}</span>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}