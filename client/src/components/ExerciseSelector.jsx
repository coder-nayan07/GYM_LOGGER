import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Filter } from 'lucide-react';
import { defaultExercises, bodyPartMap } from '../data/exercises';

export default function ExerciseSelector({ isOpen, onClose, onSelect, context = '' }) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setShowAll(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. ROBUST MATCHING LOGIC
  // Normalize context string to lowercase
  const contextLower = context.toLowerCase();
  
  // Find which key in our map matches the context string
  // e.g. "Push Day" contains "push"
  const workoutTypeKey = Object.keys(bodyPartMap).find(key => 
    contextLower.includes(key.toLowerCase())
  );
  
  const allowedBodyParts = workoutTypeKey ? bodyPartMap[workoutTypeKey] : null;

  // 2. FILTERING
  const filtered = defaultExercises.filter(ex => {
    const searchMatch = ex.name.toLowerCase().includes(query.toLowerCase()) || 
                        ex.bodyPart.toLowerCase().includes(query.toLowerCase());
    
    // If "Show All" is clicked OR we couldn't detect a split type, show everything.
    // Otherwise, strictly filter by allowed body parts.
    const isRelevant = (showAll || !allowedBodyParts) 
      ? true 
      : allowedBodyParts.includes(ex.bodyPart);

    return searchMatch && isRelevant;
  });

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gym-bg animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-gym-input bg-gym-card">
        <h2 className="text-lg font-bold text-white">Add Exercise</h2>
        <button onClick={onClose} className="p-2 bg-gym-input rounded-full text-white">
          <X size={20} />
        </button>
      </div>

      {/* Dynamic Filter Tabs */}
      <div className="flex p-2 gap-2 bg-gym-bg">
        {allowedBodyParts && (
          <button 
            onClick={() => setShowAll(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${!showAll ? 'bg-gym-accent text-white' : 'bg-gym-input text-gym-muted'}`}
          >
            {workoutTypeKey} Only
          </button>
        )}
        <button 
          onClick={() => setShowAll(true)}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${showAll || !allowedBodyParts ? 'bg-gym-accent text-white' : 'bg-gym-input text-gym-muted'}`}
        >
          All Exercises
        </button>
      </div>

      <div className="p-4 bg-gym-bg sticky top-0">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gym-muted" size={20} />
          <input 
            type="text"
            placeholder="Search..."
            className="w-full bg-gym-input text-white pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-gym-accent"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
        {filtered.map(ex => (
          <button
            key={ex.id}
            // STOP PROPAGATION ensures the click registers nicely
            onClick={(e) => { 
              e.stopPropagation();
              onSelect(ex.name); 
              onClose(); 
            }}
            className="w-full flex justify-between items-center p-4 bg-gym-card rounded-xl border border-gym-input active:bg-gym-input transition-colors"
          >
            <div className="text-left">
              <h4 className="font-bold text-white">{ex.name}</h4>
              <p className="text-xs text-gym-muted">{ex.bodyPart}</p>
            </div>
            <Plus size={20} className="text-gym-accent" />
          </button>
        ))}
      </div>
    </div>
  );
}