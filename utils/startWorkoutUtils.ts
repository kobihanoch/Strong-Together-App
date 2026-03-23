import {
  ExerciseName,
  ExercisesDuringWorkout,
  SetCountByExercise,
  SetValue,
  WorkoutPayloadRow,
} from '../hooks/types/useStartWorkoutTypes.dto';
import { FinishUserWorkoutBody } from '../types/api/workouts/requests';
import { ExerciseInPlan } from '../types/dto/workoutPlans.dto';
import { ExerciseEntity } from '../types/entities/exercise.entity';
import { ExerciseTrackingEntity } from '../types/entities/exerciseTracking.entity';

/*
[
  {"exercisetosplit_id": 1251, "notes": "Was easy!", "reps": [12], "user_id": NULL, "weight": [20.5]},
  ...
]
Passing null to server to avoid injections
*/
export const createArrayForDataBase = (workoutObj: ExercisesDuringWorkout): FinishUserWorkoutBody['workout'] => {
  if (!Object.keys(workoutObj).length) return [];
  const arr = Object.entries(workoutObj).map(([, records]): WorkoutPayloadRow | null => {
    const wArr = records.weight;
    const rArr = records.reps;
    const { weight, reps } = dropInvalidPairs(wArr, rArr);
    const etsid = records.etsid;
    const notes = records.notes;

    if (weight.length && reps.length && etsid) {
      return {
        exercisetosplit_id: etsid,
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
  weights: NonNullable<ExerciseTrackingEntity['weight']> = [],
  reps: NonNullable<ExerciseTrackingEntity['reps']> = [],
): { weight: NonNullable<ExerciseTrackingEntity['weight']>; reps: NonNullable<ExerciseTrackingEntity['reps']> } => {
  const isValid = (v: SetValue): boolean => Number.isFinite(+v) && +v !== 0;

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
  exerciseName: ExerciseEntity['name'],
  setIndex: number,
  weight: SetValue,
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
  exerciseName: ExerciseEntity['name'],
  setIndex: number,
  reps: SetValue,
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
  exerciseName: ExerciseEntity['name'],
  notes: ExerciseTrackingEntity['notes'],
): ExercisesDuringWorkout => {
  if (!state || !exerciseName || !state[exerciseName]) return state;

  const ex = state[exerciseName];
  if (ex.notes === notes) return state;

  return {
    ...state,
    [exerciseName]: { ...ex, notes },
  };
};
