import React from 'react';
import { db } from '../db';
import { defaultExercises } from '../data/exercises';
import { Trash2, RefreshCw, Database } from 'lucide-react';

export default function Settings() {
  
  const clearHistory = async () => {
    if(window.confirm("Are you sure? This will delete ALL workout history. This cannot be undone.")) {
      await db.workouts.clear();
      await db.logs.clear();
      window.location.reload();
    }
  };

  const resetDatabase = async () => {
    if(window.confirm("FULL RESET: Deletes history AND custom exercises. App will reload.")) {
      await db.delete();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gym-muted">Manage your data</p>
      </header>

      <div className="space-y-4">
        {/* Clear History Only */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-input">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gym-input rounded-lg"><Trash2 size={20} className="text-orange-500"/></div>
            <h3 className="font-bold text-white">Clear History</h3>
          </div>
          <p className="text-xs text-gym-muted mb-4">
            Removes all past workouts but keeps your exercise list.
          </p>
          <button onClick={clearHistory} className="w-full py-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg font-bold text-sm">
            Delete History
          </button>
        </div>

        {/* Full Reset */}
        <div className="bg-gym-card p-4 rounded-xl border border-gym-input">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gym-input rounded-lg"><Database size={20} className="text-red-500"/></div>
            <h3 className="font-bold text-white">Factory Reset</h3>
          </div>
          <p className="text-xs text-gym-muted mb-4">
            Wipes everything including custom exercises. Resets app to clean state.
          </p>
          <button onClick={resetDatabase} className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-bold text-sm">
            Factory Reset App
          </button>
        </div>
      </div>
    </div>
  );
}