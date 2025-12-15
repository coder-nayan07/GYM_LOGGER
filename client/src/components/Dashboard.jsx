import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const history = useLiveQuery(() => db.workouts.where('status').equals('finished').reverse().limit(5).toArray());

  return (
    <div className="p-4 pb-24">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">IronLog</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-neutral-800 p-4 rounded-xl">
          <p className="text-neutral-400 text-sm">Workouts</p>
          <p className="text-2xl font-bold">{history?.length || 0}</p>
        </div>
        <div className="bg-neutral-800 p-4 rounded-xl">
          <p className="text-neutral-400 text-sm">Streak</p>
          <p className="text-2xl font-bold text-green-400">🔥 3</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="flex flex-col gap-3">
        {history?.map(w => (
          <div key={w.id} className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-bold text-white">{w.name}</p>
              <p className="text-xs text-neutral-400">{new Date(w.startTime).toDateString()}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${w.synced ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          </div>
        ))}
        {(!history || history.length === 0) && <p className="text-neutral-500 text-center">No workouts yet. Go lift!</p>}
      </div>
    </div>
  );
}