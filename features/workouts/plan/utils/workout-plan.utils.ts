import { WorkoutSplit } from '../types/workout-plan.types';

/**
 * Categorizes a workout split's muscle group string into a generalized body region.
 *
 * Sanitizes the input by stripping parenthetical notes, splitting comma-delimited lists,
 * and filtering out core muscles (e.g., 'Abs') before determining the primary region:
 * - `"Lower Body"`: Contains exclusively legs.
 * - `"Full Body"`: Contains legs combined with other muscle groups.
 * - `"Upper Body"`: Contains any non-leg muscle groups (default fallback).
 *
 * @param muscleGroup - A comma-separated string of muscle groups (e.g., `"Chest, Triceps"` or `"Legs (Quads), Abs"`), or `null`.
 * @returns The categorized body region (`"Lower Body"`, `"Full Body"`, or `"Upper Body"`), or an empty string if `muscleGroup` is falsy.
 * */
export const getBodyPartsForSplit = (muscleGroup: WorkoutSplit['muscleGroup'] | null): string => {
  if (!muscleGroup) return '';
  const groups = muscleGroup
    .replace(/\s*\([^)]*\)/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // Remove "Abs" (case-insensitive)
  const cleaned = groups.filter((g) => g.toLowerCase() !== 'abs');
  const hasLegs = cleaned.some((g) => g.toLowerCase() === 'legs');
  const onlyLegs = hasLegs && cleaned.length === 1;

  if (onlyLegs) return 'Lower Body';
  if (hasLegs) return 'Full Body';
  return 'Upper Body';
};
