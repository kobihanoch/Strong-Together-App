import { DateTime } from 'luxon';
import { ExerciseHistoryItem } from '../../../features/workouts/history/types/exercise-history.types';
import { PrHistoryMap } from '../../../features/workouts/history/types/pr-history.types';
import { WorkoutHistoryItem, WorkoutHistoryMap } from '../../../features/workouts/history/types/workout-history.types';
import { ExerciseInPlan, WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';
import { CardioWeeklyMap } from '../../../features/workouts/cardio/types/cardio.types';
import { getStartOfWeek } from '../../../shared/utils/shared-utils';

export const TRACK_HISTORY_DAYS = 45;

type ExerciseHistory = ExerciseHistoryItem['exerciseTracked'];
type PreviousWorkout = { performance: ExerciseHistory[number]['sets']; date: string } | null;

export type TrackHistoryPoint = { date: string; value: number; reps: number; setNumber: number; isPr?: boolean };

export const getTrackHistoryDateBounds = () => {
  const today = DateTime.local().startOf('day');
  return {
    today: today.toISODate()!,
    minDate: today.minus({ days: TRACK_HISTORY_DAYS - 1 }).toISODate()!,
  };
};

export const getTrackWorkout = (history: WorkoutHistoryMap | undefined, selectedDate: string) => history?.byDate[selectedDate] ?? null;

export const getTrackWorkoutDates = (history: WorkoutHistoryMap | undefined) => new Set(Object.keys(history?.byDate ?? {}));

/** Builds the Sunday-to-Saturday cardio bars for the selected week. */
export const getTrackCardioWeek = (weeklyMap: CardioWeeklyMap | undefined, selectedDate: string) => {
  const minutes = [0, 0, 0, 0, 0, 0, 0];
  const records = weeklyMap?.[getStartOfWeek(selectedDate)]?.records ?? [];

  records.forEach((record) => {
    minutes[new Date(record.workoutTimeLocal).getDay()] += record.durationMins;
  });

  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => ({ label, minutes: minutes[index] }));
};

export const getMaxWeight = (sets: ExerciseHistory[number]['sets']) => Math.max(0, ...sets.map((set) => set.weight));

export const getTopSet = (sets: ExerciseHistory[number]['sets']) => {
  const topSet = sets.reduce<(typeof sets)[number] | null>((best, set) => (!best || set.weight > best.weight ? set : best), null);
  return topSet ? { value: topSet.weight, reps: topSet.reps, setNumber: topSet.setIndex + 1 } : { value: 0, reps: 0, setNumber: 1 };
};

export const getProgressChange = (points: TrackHistoryPoint[]) => {
  const firstValue = points[0]?.value ?? 0;
  const lastValue = points[points.length - 1]?.value ?? 0;
  return firstValue ? ((lastValue - firstValue) / firstValue) * 100 : 0;
};

export const getPreviousBest = (exerciseHistory: ExerciseHistory, selectedDate: string) => {
  const previousWeights = exerciseHistory
    .filter((entry) => entry.workoutStartLocal.slice(0, 10) < selectedDate)
    .flatMap((entry) => entry.sets.map((set) => set.weight));
  return previousWeights.length ? Math.max(...previousWeights) : null;
};

export const getPlannedSetCounts = (splits: WorkoutSplit[]) => {
  const counts = new Map<number, number>();
  splits.forEach((split) => {
    split.exercises.forEach((exercise) => {
      if (exercise.exerciseToSplitId !== null) counts.set(exercise.exerciseToSplitId, exercise.sets.length);
    });
  });
  return counts;
};

export const getMaxWeightProgress = (
  exerciseHistory: ExerciseHistory,
  selectedDate: string,
  currentSets: ExerciseHistory[number]['sets'],
): TrackHistoryPoint[] => {
  const points = exerciseHistory
    .filter((entry) => entry.workoutStartLocal.slice(0, 10) <= selectedDate)
    .sort((a, b) => b.workoutStartLocal.localeCompare(a.workoutStartLocal))
    .slice(0, 5)
    .sort((a, b) => a.workoutStartLocal.localeCompare(b.workoutStartLocal))
    .map((entry) => ({ date: entry.workoutStartLocal, ...getTopSet(entry.sets) }));

  // A freshly completed workout can reach this map before exercise history refreshes.
  if (!points.some((point) => point.date.slice(0, 10) === selectedDate)) {
    points.push({ date: selectedDate, ...getTopSet(currentSets) });
  }

  return points.sort((a, b) => a.date.localeCompare(b.date)).slice(-5);
};

export const buildTrackExercises = (
  workout: WorkoutHistoryItem | null,
  prs: PrHistoryMap | undefined,
  selectedDate: string,
  plannedSetCounts: Map<number, number>,
  getExerciseHistory: (id: ExerciseInPlan['exerciseToSplitId'] | null) => ExerciseHistory,
  getPreviousWorkout: (id: ExerciseInPlan['exerciseToSplitId'] | null, beforeDate: string) => PreviousWorkout,
) => {
  return (workout?.exerciseTracked ?? [])
    .map(({ exerciseTracking }) => {
      const assignment = exerciseTracking.exerciseAssignment;
      const exerciseHistory = getExerciseHistory(assignment.exerciseToSplitId);
      const previous = getPreviousWorkout(assignment.exerciseToSplitId, selectedDate);
      const currentMax = getMaxWeight(exerciseTracking.sets);
      const currentPr = prs?.prs[exerciseTracking.exerciseAssignment.exerciseId];
      const plannedSetCount = assignment.exerciseToSplitId === null ? null : (plannedSetCounts.get(assignment.exerciseToSplitId) ?? null);
      const isPr = Boolean(
        currentPr &&
        selectedDate === currentPr.workoutStartLocal.slice(0, 10) &&
        exerciseTracking.sets.some((set) => set.weight === currentPr.prWeight && set.reps === currentPr.prReps),
      );

      return {
        id: exerciseTracking.exerciseTrackingId,
        orderIndex: assignment.orderIndex ?? Number.MAX_SAFE_INTEGER,
        name: assignment.exerciseName,
        muscle: assignment.specificTargetMuscle || assignment.targetMuscle,
        splitName: assignment.workoutSplitName,
        sets: exerciseTracking.sets.map((set) => ({
          ...set,
          isExtra: plannedSetCount !== null && set.setIndex >= plannedSetCount,
        })),
        addedDuringWorkout: assignment.exerciseToSplitId === null,
        isPr,
        currentMax,
        previousBest: getPreviousBest(exerciseHistory, selectedDate),
        previousMax: previous ? getMaxWeight(previous.performance) : null,
        previousDate: previous?.date ?? null,
        progress: getMaxWeightProgress(exerciseHistory, selectedDate, exerciseTracking.sets),
      };
    })
    .sort((a, b) => a.orderIndex - b.orderIndex);
};
