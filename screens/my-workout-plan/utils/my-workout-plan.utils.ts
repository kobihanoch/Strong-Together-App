import type { GetWorkoutStatisticsResponse } from '@strong-together/shared';
import { DateTime } from 'luxon';
import type { WorkoutHistoryMap } from '../../../features/workouts/history/types/workout-history.types';
import type { WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';

export type WorkoutWeekDay = {
  label: string;
  date: string;
  trained: boolean;
  isToday: boolean;
};

export const selectWorkoutSplit = (workoutSplits: WorkoutSplit[], selectedSplitId: number | null): WorkoutSplit | null =>
  workoutSplits.find((split) => split.id === selectedSplitId) ?? workoutSplits[0] ?? null;

export const deriveSelectedSplitDetails = (selectedSplit: WorkoutSplit | null) => ({
  setCount: selectedSplit?.exercises.reduce((total, exercise) => total + exercise.sets.length, 0) ?? 0,
  muscles: Array.from(new Set(selectedSplit?.exercises.map((exercise) => exercise.targetMuscle) ?? [])).slice(0, 3),
});

export const deriveWorkoutWeekDays = (history: WorkoutHistoryMap | undefined, now = DateTime.now()): WorkoutWeekDay[] => {
  const today = now.startOf('day');
  const sunday = today.minus({ days: today.weekday % 7 });
  const trainedDates = new Set(Object.keys(history?.byDate ?? {}));

  return Array.from({ length: 7 }, (_, index) => {
    const date = sunday.plus({ days: index });
    const isoDate = date.toISODate() ?? '';
    return {
      label: date.toFormat('ccccc'),
      date: isoDate,
      trained: trainedDates.has(isoDate),
      isToday: date.hasSame(today, 'day'),
    };
  });
};

export const deriveSelectedSplitDates = (history: WorkoutHistoryMap | undefined, selectedSplit: WorkoutSplit | null): string[] => {
  if (!selectedSplit) return [];

  return Object.entries(history?.byDate ?? {})
    .filter(([, workout]) =>
      workout.exerciseTracked.some(
        ({ exerciseTracking }) => exerciseTracking.exerciseAssignment.workoutSplitId === selectedSplit.id,
      ),
    )
    .map(([date]) => date)
    .sort()
    .reverse();
};

export const deriveWorkoutTargets = (statistics: GetWorkoutStatisticsResponse | undefined) => ({
  completedThisWeek: statistics?.workoutTargets.workoutCountThisWeek ?? 0,
  weeklyTarget: statistics?.workoutTargets.workoutCountScheduledPerWeek ?? 0,
});

export const calculateWeeklyProgress = (completedThisWeek: number, weeklyTarget: number) =>
  weeklyTarget > 0 ? Math.min(Math.max(completedThisWeek / weeklyTarget, 0), 1) : 0;
