import { getStartOfWeek } from '../../../shared/utils/shared-utils';
import { CardioWeeklyMap } from '../../../features/workouts/cardio/types/cardio.types';
import { WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';
import { HomeDashboardStats } from '../../../features/dashboard/types/dashboard.types';
import { WorkoutSchedulesItem } from '../../../features/workout-schedule/types/workout-schedule.types';
import { WorkoutHistoryMap } from '../../../features/workouts/history/types/workout-history.types';
import { DateTime } from 'luxon';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const formatScheduleTime = (startTime: string) => startTime.slice(0, 5);

export const getScheduleDayLabel = (dayOfWeek: number, today = new Date()) => {
  const difference = (dayOfWeek - today.getDay() + 7) % 7;
  if (difference === 0) return 'Today';
  if (difference === 1) return 'Tomorrow';

  const date = new Date(today);
  date.setDate(today.getDate() + difference);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getDaysSince = (lastDateString: string): string => {
  if (!lastDateString) return 'today';
  const lastDate = new Date(lastDateString);
  const today = new Date();

  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
    default:
      if (diffDays < 30) {
        return `${diffDays} days ago`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} mo${months > 1 ? 's' : ''} ago`;
      } else {
        const years = Math.floor(diffDays / 365);
        return `${years} yr${years > 1 ? 's' : ''} ago`;
      }
  }
};

export const getNextWorkoutSplit = (workoutSplits: WorkoutSplit[], nextWorkoutSplit: HomeDashboardStats['nextSplitByOrderIndex'] | null) => {
  return workoutSplits.find((split) => split.id === nextWorkoutSplit?.id);
};

export const fillCardioGraph = (weeklyCardioMap: CardioWeeklyMap | undefined) => {
  const cardioForThisWeek = weeklyCardioMap?.[getStartOfWeek()]?.records ?? [];
  const aerobicMinutes = [0, 0, 0, 0, 0, 0, 0];
  cardioForThisWeek.forEach((record) => {
    aerobicMinutes[new Date(record.workoutTimeLocal).getDay()] += record.durationMins;
  });
  return [0, 1, 2, 3, 4, 5, 6].map((dayIndex) => ({
    label: DAY_LABELS[dayIndex],
    minutes: aerobicMinutes[dayIndex],
  }));
};

export const getTodayWorkout = (history: WorkoutHistoryMap | undefined, timeZone: string) => {
  const date = DateTime.now().setZone(timeZone).toISODate();
  const workout = date ? history?.byDate[date] : undefined;
  const tracked = workout?.exerciseTracked ?? [];
  const assignment = tracked[0]?.exerciseTracking.exerciseAssignment;

  if (!workout || !assignment) return null;

  return {
    date: date!,
    id: assignment.workoutSplitId,
    name: assignment.workoutSplitName,
    durationMinutes: workout.durationMins,
    exerciseCount: tracked.length,
    setCount: tracked.reduce((total, item) => total + item.exerciseTracking.sets.length, 0),
  };
};

export const getScheduleWeek = (
  schedules: WorkoutSchedulesItem[],
  splits: WorkoutSplit[],
  history: WorkoutHistoryMap | undefined,
  timeZone: string,
) => {
  const now = DateTime.now().setZone(timeZone);
  const sunday = now.startOf('day').minus({ days: now.weekday % 7 });

  return Array.from({ length: 7 }, (_, index) => {
    const date = sunday.plus({ days: index });
    const dayOfWeek = date.weekday % 7;
    const schedule = schedules.find((item) => item.dayOfWeek === dayOfWeek);
    const split = splits.find((item) => item.id === schedule?.workoutSplitId);
    const tracked = history?.byDate[date.toISODate() ?? '']?.exerciseTracked ?? [];
    const workout = history?.byDate[date.toISODate() ?? ''];
    const completedSplits = new Map(tracked.map((item) => {
      const assignment = item.exerciseTracking.exerciseAssignment;
      return [assignment.workoutSplitId, assignment.workoutSplitName] as const;
    }));
    const day = {
      label: date.toFormat('ccc').slice(0, 1),
      date: date.toISODate() ?? '',
      isToday: date.hasSame(now, 'day'),
    };
    const completed = schedule ? completedSplits.has(schedule.workoutSplitId) : false;
    const extraRows = Array.from(completedSplits).filter(([id]) => id !== schedule?.workoutSplitId).map(([id, name]) => ({
      ...day,
      completed: true,
      isScheduled: false,
      name: name || splits.find((item) => item.id === id)?.name || 'Workout',
      startTime: '',
      durationMinutes: completedSplits.size === 1 && workout ? Math.round(workout.durationMins) : null,
    }));
    return [...(schedule ? [{
      ...day,
      completed,
      isScheduled: true,
      name: split?.name || completedSplits.get(schedule.workoutSplitId) || 'Workout',
      startTime: schedule.startTime?.slice(0, 5) ?? '',
      durationMinutes: completed && completedSplits.size === 1 && workout ? Math.round(workout.durationMins) : null,
    }] : []), ...extraRows];
  }).flat();
};

export const formatNextSchedule = (dayOfWeek: number, startTime: string, timeZone: string) => {
  const now = DateTime.now().setZone(timeZone);
  const daysAhead = (dayOfWeek - (now.weekday % 7) + 7) % 7;
  const day = daysAhead === 0 ? 'Today' : now.plus({ days: daysAhead }).toFormat('cccc');
  return `${day} · ${startTime.slice(0, 5)}`;
};
