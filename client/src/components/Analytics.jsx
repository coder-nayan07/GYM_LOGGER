import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
);

export default function Analytics() {
  // Fetch all finished workouts
  const workouts = useLiveQuery(() => 
    db.workouts.where('status').equals('finished').sortBy('startTime')
  );

  // 1. Weekly Workout Count Data
  const weeklyData = useMemo(() => {
    if (!workouts) return null;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);
    
    workouts.forEach(w => {
      const day = new Date(w.startTime).getDay();
      counts[day]++;
    });

    return {
      labels: days,
      datasets: [{
        label: 'Workouts',
        data: counts,
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      }]
    };
  }, [workouts]);

  // 2. Volume Progression (Mock logic: In a real app, calculate total tonnage per workout)
  // For now, we visualize workout duration/frequency trend
  const trendData = useMemo(() => {
    if (!workouts) return null;
    return {
      labels: workouts.map(w => new Date(w.startTime).toLocaleDateString(undefined, {month:'short', day:'numeric'})),
      datasets: [{
        label: 'Duration (min)',
        data: workouts.map(w => {
            const start = new Date(w.startTime);
            const end = w.endTime ? new Date(w.endTime) : new Date();
            return Math.round((end - start) / 1000 / 60);
        }),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  }, [workouts]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { 
        backgroundColor: '#171717', 
        titleColor: '#fff',
        bodyColor: '#a3a3a3',
        borderColor: '#333',
        borderWidth: 1
      }
    },
    scales: {
      y: { grid: { color: '#333' }, ticks: { color: '#737373' } },
      x: { grid: { display: false }, ticks: { color: '#737373' } }
    }
  };

  if (!workouts || workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gym-muted p-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No Data Yet</h2>
        <p>Complete your first workout to see your analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <header className="mb-6">
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gym-muted">Track your consistency and volume</p>
        </header>

        {/* Weekly Consistency Chart */}
        <div className="bg-gym-card p-4 rounded-2xl border border-gym-input">
            <h3 className="text-lg font-bold text-white mb-4">Weekly Frequency</h3>
            <div className="h-48">
                {weeklyData && <Bar data={weeklyData} options={chartOptions} />}
            </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-gym-card p-4 rounded-2xl border border-gym-input">
            <h3 className="text-lg font-bold text-white mb-4">Duration Trend</h3>
            <div className="h-48">
                {trendData && <Line data={trendData} options={chartOptions} />}
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-gym-card p-4 rounded-xl border border-gym-input">
                <p className="text-gym-muted text-xs uppercase font-bold">Total Workouts</p>
                <p className="text-2xl font-bold text-white">{workouts.length}</p>
            </div>
            <div className="bg-gym-card p-4 rounded-xl border border-gym-input">
                <p className="text-gym-muted text-xs uppercase font-bold">Avg Duration</p>
                <p className="text-2xl font-bold text-white">
                    {workouts.length > 0 ? Math.round(trendData.datasets[0].data.reduce((a,b)=>a+b,0) / workouts.length) : 0} <span className="text-sm font-normal text-gym-muted">min</span>
                </p>
            </div>
        </div>
    </div>
  );
}