import { ExerciseInPlan } from '../../plan/types/workout-plan.types';
import { ExerciseHistoryMap } from '../types/exercise-history.types';

export const checkHasVisibleHistory = (exerciseHistoryMap: ExerciseHistoryMap | undefined | null) => {
  if (!exerciseHistoryMap) return false;
  return Object.keys(exerciseHistoryMap?.byExerciseToSplitId ?? {}).length > 0;
};

export const getLastLogPerformance = (
  exerciseHistoryMap: ExerciseHistoryMap | undefined | null,
  exerciseToSplitId: ExerciseInPlan['exerciseToSplitId'] | null,
) => {
  if (!exerciseToSplitId || !exerciseHistoryMap) return null;
  const lastOccured = exerciseHistoryMap?.byExerciseToSplitId?.[exerciseToSplitId]?.exerciseTracked?.[0] ?? null;
  return lastOccured ? { performance: lastOccured?.sets, date: lastOccured?.workoutStartLocal } : null;
};

export const getLastWorkoutData = (
  exerciseHistoryMap: ExerciseHistoryMap | undefined | null,
  exerciseToSplitId: ExerciseInPlan['exerciseToSplitId'] | null,
  beforeDate?: string,
) => {
  if (!exerciseToSplitId) return null;
  const entries = exerciseHistoryMap?.byExerciseToSplitId?.[exerciseToSplitId]?.exerciseTracked ?? [];
  const entry = entries.find((item) => !beforeDate || item.workoutStartLocal.slice(0, 10) < beforeDate);
  return entry ? { performance: entry.sets, date: entry.workoutStartLocal } : null;
};
