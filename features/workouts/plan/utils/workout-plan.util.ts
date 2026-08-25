import type { WorkoutSplit } from '../../shared/types/workout.types';

export const getBodyPartsForSplit = (split: WorkoutSplit | null): string => {
  if (!split || !split?.muscleGroup) return '';
  const groups = split.muscleGroup
    .replace(/\s*\([^)]*\)/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // 3) Remove "Abs" (case-insensitive)
  const cleaned = groups.filter((g) => g.toLowerCase() !== 'abs');

  // 4) Decide category:
  //    - Exactly ["Legs"] => "Lower Body"
  //    - Includes "Legs" with other muscles => "Full Body"
  //    - Otherwise => "Upper Body"
  const hasLegs = cleaned.some((g) => g.toLowerCase() === 'legs');
  const onlyLegs = hasLegs && cleaned.length === 1;

  if (onlyLegs) return 'Lower Body';
  if (hasLegs) return 'Full Body';
  return 'Upper Body';
};
