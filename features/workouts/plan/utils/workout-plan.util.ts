import type { ExerciseInPlan, WorkoutPlan } from '../../shared/types/workout.types';
import type { WorkoutPlanSplit } from '../types/workout-plan.types';

type SplitName = WorkoutPlanSplit['name'];
type SplitId = WorkoutPlanSplit['id'];
type MuscleGroup = WorkoutPlanSplit['muscleGroup'];

// Returns an obj
// {
//  workoutSplits = [{name: A, id: 1, muscleGroup:...}, {name: B, id: 2. muscleGroup:...},....]
//  exercises = {A: [exercises...], B: [exercises...]}
// }
type ExtractWorkoutSplitsReturnType = {
  workoutSplits: {
    name: SplitName;
    id: SplitId;
    muscleGroup: MuscleGroup;
  }[];
  exercises: Record<SplitName, ExerciseInPlan[]>;
};

export const extractWorkoutSplits = (workout: WorkoutPlan | null | undefined): ExtractWorkoutSplitsReturnType | undefined => {
  if (workout === null || workout?.workoutSplits === null)
    return { workoutSplits: [], exercises: {} as Record<SplitName, ExerciseInPlan[]> };
  if (workout === undefined) return undefined;
  const map = workout.workoutSplits.reduce((acc: Record<SplitName, ExerciseInPlan[]>, split) => {
    const splitName = split.name;
    const splitExFields = split.exerciseToWorkoutSplit || [];
    acc[splitName!] = [...splitExFields];
    return acc;
  }, {});

  const arr = workout.workoutSplits.reduce(
    (acc: { arr: { name: SplitName; id: SplitId; muscleGroup: MuscleGroup }[] }, split) => {
      acc.arr.push({
        name: split.name!,
        id: split.id,
        muscleGroup: split.muscleGroup!,
      });
      return acc;
    },
    { arr: [] },
  );

  return { workoutSplits: arr.arr, exercises: map };
};

export const getBodyPartsForSplit = (split: WorkoutPlanSplit | null): string => {
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
