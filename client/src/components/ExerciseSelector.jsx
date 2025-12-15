import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Filter } from 'lucide-react';
import { defaultExercises, bodyPartMap } from '../data/exercises';

export default function ExerciseSelector({ isOpen, onClose, onSelect, context = '' }) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Reset filter when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setShowAll(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine which body parts are relevant
  const relevantParts = Object.keys(bodyPartMap).find(key => context.includes(key)) 
    ? bodyPartMap[Object.keys(bodyPartMap).find(key => context.includes(key))]
    : null;

  // Filtering Logic
  const filtered = defaultExercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(query.toLowerCase()) || 
                          ex.bodyPart.toLowerCase().includes(query.toLowerCase());
    
    const isRelevant = !relevantParts || showAll || relevantParts.includes(ex.bodyPart);

    return matchesSearch && isRelevant;
  });

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gym-bg animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gym-input bg-gym-card">
        <h2 className="text-lg font-bold">Add Exercise</h2>
        <button onClick={onClose} className="p-2 bg-gym-input rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* Smart Filter Tabs */}
      {relevantParts && (
        <div className="flex p-2 gap-2 bg-gym-bg">
          <button 
            onClick={() => setShowAll(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!showAll ? 'bg-gym-accent text-white' : 'bg-gym-input text-gym-muted'}`}
          >
            {context.split(' ')[0]} Only
          </button>
          <button 
            onClick={() => setShowAll(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${showAll ? 'bg-gym-accent text-white' : 'bg-gym-input text-gym-muted'}`}
          >
            Show All
          </button>
        </div>
      )}

      {/* Search */}
      <div className="p-4 bg-gym-bg">
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
      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
        {filtered.map(ex => (
          <button
            key={ex.id}
            onClick={() => { onSelect(ex.name); onClose(); }}
            className="w-full flex justify-between items-center p-4 bg-gym-card rounded-xl border border-gym-input active:bg-gym-input transition-colors"
          >
            <div className="text-left">
              <h4 className="font-bold text-white">{ex.name}</h4>
              <p className="text-xs text-gym-muted">{ex.bodyPart} • {ex.category}</p>
            </div>
            <Plus size={20} className="text-gym-accent" />
          </button>
        ))}
        
        {filtered.length === 0 && (
          <div className="text-center text-gym-muted mt-8">
            <p>No exercises found.</p>
            {!showAll && relevantParts && (
              <button onClick={() => setShowAll(true)} className="text-gym-accent underline mt-2">
                Search all exercises
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}