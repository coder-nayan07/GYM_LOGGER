import React, { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { defaultExercises } from '../data/exercises';

export default function ExerciseSelector({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = defaultExercises.filter(ex => 
    ex.name.toLowerCase().includes(query.toLowerCase()) || 
    ex.bodyPart.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gym-bg animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gym-input bg-gym-card">
        <h2 className="text-lg font-bold">Add Exercise</h2>
        <button onClick={onClose} className="p-2 bg-gym-input rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 bg-gym-bg sticky top-0">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gym-muted" size={20} />
          <input 
            type="text"
            placeholder="Search exercises..."
            className="w-full bg-gym-input text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gym-accent"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.map(ex => (
          <button
            key={ex.id}
            onClick={() => { onSelect(ex.name); onClose(); setQuery(''); }}
            className="w-full flex justify-between items-center p-4 bg-gym-card rounded-xl border border-gym-input active:bg-gym-input transition-colors"
          >
            <div className="text-left">
              <h4 className="font-bold text-white">{ex.name}</h4>
              <p className="text-xs text-gym-muted">{ex.bodyPart} • {ex.category}</p>
            </div>
            <Plus size={20} className="text-gym-accent" />
          </button>
        ))}
      </div>
    </div>
  );
}