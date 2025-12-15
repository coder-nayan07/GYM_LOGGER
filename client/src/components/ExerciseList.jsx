// src/data/exercises.js

export const bodyPartMap = {
    'Push': ['Chest', 'Shoulders', 'Triceps'],
    'Pull': ['Back', 'Biceps', 'Rear Delts', 'Traps'],
    'Legs': ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    'Upper': ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'],
    'Lower': ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    'Full Body': ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms']
  };
  
  export const defaultExercises = [
    // --- CHEST (Push) ---
    { id: 'ch_1', name: 'Barbell Bench Press', bodyPart: 'Chest', category: 'Barbell' },
    { id: 'ch_2', name: 'Incline Dumbbell Press', bodyPart: 'Chest', category: 'Dumbbell' },
    { id: 'ch_3', name: 'Cable Fly', bodyPart: 'Chest', category: 'Cable' },
    { id: 'ch_4', name: 'Push Up', bodyPart: 'Chest', category: 'Bodyweight' },
    { id: 'ch_5', name: 'Pec Deck Machine', bodyPart: 'Chest', category: 'Machine' },
    { id: 'ch_6', name: 'Dips (Weighted)', bodyPart: 'Chest', category: 'Bodyweight' },
  
    // --- SHOULDERS (Push) ---
    { id: 'sh_1', name: 'Overhead Barbell Press', bodyPart: 'Shoulders', category: 'Barbell' },
    { id: 'sh_2', name: 'Dumbbell Lateral Raise', bodyPart: 'Shoulders', category: 'Dumbbell' },
    { id: 'sh_3', name: 'Face Pull', bodyPart: 'Rear Delts', category: 'Cable' },
    { id: 'sh_4', name: 'Arnold Press', bodyPart: 'Shoulders', category: 'Dumbbell' },
    { id: 'sh_5', name: 'Cable Lateral Raise', bodyPart: 'Shoulders', category: 'Cable' },
  
    // --- TRICEPS (Push) ---
    { id: 'tr_1', name: 'Tricep Pushdown (Rope)', bodyPart: 'Triceps', category: 'Cable' },
    { id: 'tr_2', name: 'Skullcrusher', bodyPart: 'Triceps', category: 'Barbell' },
    { id: 'tr_3', name: 'Overhead Extension', bodyPart: 'Triceps', category: 'Dumbbell' },
  
    // --- BACK (Pull) ---
    { id: 'bk_1', name: 'Deadlift', bodyPart: 'Back', category: 'Barbell' },
    { id: 'bk_2', name: 'Pull Up', bodyPart: 'Back', category: 'Bodyweight' },
    { id: 'bk_3', name: 'Lat Pulldown', bodyPart: 'Back', category: 'Machine' },
    { id: 'bk_4', name: 'Barbell Row', bodyPart: 'Back', category: 'Barbell' },
    { id: 'bk_5', name: 'Seated Cable Row', bodyPart: 'Back', category: 'Cable' },
    { id: 'bk_6', name: 'Single Arm Dumbbell Row', bodyPart: 'Back', category: 'Dumbbell' },
  
    // --- BICEPS (Pull) ---
    { id: 'bi_1', name: 'Barbell Curl', bodyPart: 'Biceps', category: 'Barbell' },
    { id: 'bi_2', name: 'Hammer Curl', bodyPart: 'Biceps', category: 'Dumbbell' },
    { id: 'bi_3', name: 'Preacher Curl Machine', bodyPart: 'Biceps', category: 'Machine' },
    { id: 'bi_4', name: 'Incline Dumbbell Curl', bodyPart: 'Biceps', category: 'Dumbbell' },
  
    // --- LEGS ---
    { id: 'lg_1', name: 'Barbell Squat', bodyPart: 'Quadriceps', category: 'Barbell' },
    { id: 'lg_2', name: 'Leg Press', bodyPart: 'Quadriceps', category: 'Machine' },
    { id: 'lg_3', name: 'Romanian Deadlift', bodyPart: 'Hamstrings', category: 'Barbell' },
    { id: 'lg_4', name: 'Leg Extension', bodyPart: 'Quadriceps', category: 'Machine' },
    { id: 'lg_5', name: 'Lying Leg Curl', bodyPart: 'Hamstrings', category: 'Machine' },
    { id: 'lg_6', name: 'Bulgarian Split Squat', bodyPart: 'Quadriceps', category: 'Dumbbell' },
    { id: 'lg_7', name: 'Calf Raise (Standing)', bodyPart: 'Calves', category: 'Machine' },
    { id: 'lg_8', name: 'Hip Thrust', bodyPart: 'Glutes', category: 'Barbell' },
  ];