// src/data/exercises.js

export const bodyPartMap = {
  'Push': ['Chest', 'Shoulders', 'Triceps'],
  'Pull': ['Back', 'Biceps', 'Rear Delts', 'Traps'],
  'Leg': ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'], // Changed 'Legs' to 'Leg' to match "Leg Day"
  'Upper': ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'],
  'Lower': ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
  'Full': ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'] // Matches "Full Body"
};

export const defaultExercises = [
  // --- CHEST (Push) ---
  { id: 'new_ch_1', name: 'Barbell Bench Press', bodyPart: 'Chest', category: 'Barbell' },
  { id: 'new_ch_2', name: 'Incline Dumbbell Press', bodyPart: 'Chest', category: 'Dumbbell' },
  { id: 'new_ch_3', name: 'Cable Fly', bodyPart: 'Chest', category: 'Cable' },
  { id: 'new_ch_4', name: 'Push Up', bodyPart: 'Chest', category: 'Bodyweight' },
  { id: 'new_ch_5', name: 'Pec Deck Machine', bodyPart: 'Chest', category: 'Machine' },
  { id: 'new_ch_6', name: 'Dips', bodyPart: 'Chest', category: 'Bodyweight' },

  // --- SHOULDERS (Push) ---
  { id: 'new_sh_1', name: 'Overhead Press', bodyPart: 'Shoulders', category: 'Barbell' },
  { id: 'new_sh_2', name: 'Lateral Raise', bodyPart: 'Shoulders', category: 'Dumbbell' },
  { id: 'new_sh_3', name: 'Face Pull', bodyPart: 'Rear Delts', category: 'Cable' },
  { id: 'new_sh_4', name: 'Arnold Press', bodyPart: 'Shoulders', category: 'Dumbbell' },

  // --- TRICEPS (Push) ---
  { id: 'new_tr_1', name: 'Tricep Pushdown', bodyPart: 'Triceps', category: 'Cable' },
  { id: 'new_tr_2', name: 'Skullcrusher', bodyPart: 'Triceps', category: 'Barbell' },
  { id: 'new_tr_3', name: 'Overhead Extension', bodyPart: 'Triceps', category: 'Dumbbell' },

  // --- BACK (Pull) ---
  { id: 'new_bk_1', name: 'Deadlift', bodyPart: 'Back', category: 'Barbell' },
  { id: 'new_bk_2', name: 'Pull Up', bodyPart: 'Back', category: 'Bodyweight' },
  { id: 'new_bk_3', name: 'Lat Pulldown', bodyPart: 'Back', category: 'Machine' },
  { id: 'new_bk_4', name: 'Barbell Row', bodyPart: 'Back', category: 'Barbell' },
  { id: 'new_bk_5', name: 'Seated Cable Row', bodyPart: 'Back', category: 'Cable' },

  // --- BICEPS (Pull) ---
  { id: 'new_bi_1', name: 'Barbell Curl', bodyPart: 'Biceps', category: 'Barbell' },
  { id: 'new_bi_2', name: 'Hammer Curl', bodyPart: 'Biceps', category: 'Dumbbell' },
  { id: 'new_bi_3', name: 'Preacher Curl', bodyPart: 'Biceps', category: 'Machine' },

  // --- LEGS ---
  { id: 'new_lg_1', name: 'Barbell Squat', bodyPart: 'Quadriceps', category: 'Barbell' },
  { id: 'new_lg_2', name: 'Leg Press', bodyPart: 'Quadriceps', category: 'Machine' },
  { id: 'new_lg_3', name: 'Romanian Deadlift', bodyPart: 'Hamstrings', category: 'Barbell' },
  { id: 'new_lg_4', name: 'Leg Extension', bodyPart: 'Quadriceps', category: 'Machine' },
  { id: 'new_lg_5', name: 'Lying Leg Curl', bodyPart: 'Hamstrings', category: 'Machine' },
  { id: 'new_lg_6', name: 'Bulgarian Split Squat', bodyPart: 'Quadriceps', category: 'Dumbbell' },
  { id: 'new_lg_7', name: 'Calf Raise', bodyPart: 'Calves', category: 'Machine' },
];