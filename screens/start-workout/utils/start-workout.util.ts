import type { ExerciseName, ExercisesDuringWorkout, SetCountByExercise, WorkoutPayloadRow, } from '../types/use-start-workout.types';
import type { ExerciseInPlan } from '../../../features/workouts/plan/types/workout-plan.types';
import type { Exercise } from '../../../features/workouts/plan/types/workout-plan.types';

/*
[
  {"exerciseToSplitId": 1251, "notes": "Was easy!", "reps": [12], "userId": NULL, "weight": [20.5]},
  ...
]
Passing null to server to avoid injections
*/
export const createArrayForDataBase = (workoutObj: ExercisesDuringWorkout): WorkoutPayloadRow[] => {
  if (!Object.keys(workoutObj).length) return [];
  const arr = Object.entries(workoutObj).map(([, records]): WorkoutPayloadRow | null => {
    const wArr = records.weight;
    const rArr = records.reps;
    const { weight, reps } = dropInvalidPairs(wArr, rArr);
    const etsid = records.etsid;
    const notes = records.notes;

    if (weight.length && reps.length && etsid) {
      return {
        exerciseToSplitId: etsid,
        weight,
        reps,
        notes,
      };
    }

    return null;
  });

  return arr.filter((ex): ex is WorkoutPayloadRow => ex !== null);
};

const dropInvalidPairs = (
  weights: number[] = [],
  reps: number[] = [],
): { weight: number[]; reps: number[] } => {
  const isValid = (v: number): boolean => Number.isFinite(+v) && +v !== 0;

  const maxLen = Math.min(weights.length, reps.length);

  const filteredWeights = weights.slice(0, maxLen).filter((_, i) => isValid(weights[i]) && isValid(reps[i]));

  const filteredReps = reps.slice(0, maxLen).filter((_, i) => isValid(weights[i]) && isValid(reps[i]));

  return {
    weight: filteredWeights,
    reps: filteredReps,
  };
};

export const countSetsDone = (
  workoutProgressObj: ExercisesDuringWorkout | null,
  exercisesForSelectedSplit: ExerciseInPlan[] | null,
): { sum: number; byExercise: SetCountByExercise } => {
  if (!workoutProgressObj || !exercisesForSelectedSplit) return { sum: 0, byExercise: {} as SetCountByExercise };
  let sum = 0;
  const byExercise = {} as SetCountByExercise;

  for (const [name, rec] of Object.entries(workoutProgressObj) as [
    ExerciseName,
    ExercisesDuringWorkout[ExerciseName],
  ][]) {
    const planned = exercisesForSelectedSplit.find((e) => e.exercise === name)?.sets?.length ?? 0;

    const wArr = rec?.weight ?? [];
    const rArr = rec?.reps ?? [];

    let done = 0;
    for (let i = 0; i < planned; i++) {
      const bothUpdated = i in wArr && i in rArr && wArr[i] !== 0 && rArr[i] !== 0;
      if (bothUpdated) done++;
    }

    byExercise[name] = { done, planned };
    sum += done;
  }

  return { sum, byExercise };
};

export const applyWeight = (
  state: ExercisesDuringWorkout,
  exerciseName: Exercise['name'],
  setIndex: number,
  weight: number,
): ExercisesDuringWorkout => {
  if (!state || !exerciseName || !state[exerciseName] || !Number.isInteger(setIndex) || setIndex < 0) return state;

  const ex = state[exerciseName];
  const current = Array.isArray(ex.weight) ? ex.weight : [];

  if (current[setIndex] === weight) return state;

  const nextWeight = current.slice();
  nextWeight[setIndex] = weight;

  return {
    ...state,
    [exerciseName]: { ...ex, weight: nextWeight },
  };
};

export const applyReps = (
  state: ExercisesDuringWorkout,
  exerciseName: Exercise['name'],
  setIndex: number,
  reps: number,
): ExercisesDuringWorkout => {
  if (!state || !exerciseName || !state[exerciseName] || !Number.isInteger(setIndex) || setIndex < 0) return state;

  const ex = state[exerciseName];
  const current = Array.isArray(ex.reps) ? ex.reps : [];

  if (current[setIndex] === reps) return state;

  const nextReps = current.slice();
  nextReps[setIndex] = reps;

  return {
    ...state,
    [exerciseName]: { ...ex, reps: nextReps },
  };
};

export const applyNotes = (
  state: ExercisesDuringWorkout,
  exerciseName: Exercise['name'],
  notes: string | null,
): ExercisesDuringWorkout => {
  if (!state || !exerciseName || !state[exerciseName]) return state;

  const ex = state[exerciseName];
  if (ex.notes === notes) return state;

  return {
    ...state,
    [exerciseName]: { ...ex, notes },
  };
};

