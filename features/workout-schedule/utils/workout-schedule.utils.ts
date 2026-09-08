import { WorkoutSchedules } from '../types/workout-schedule.types';

export const getNextScheduledWorkout = (workoutSchedules: WorkoutSchedules['schedules'] | undefined) => {
  if (!workoutSchedules?.length) return null;

  const now = new Date();
  const currentTotalMinutes = now.getDay() * 24 * 60 + now.getHours() * 60 + now.getMinutes();
  const weekMinutes = 7 * 24 * 60;

  const next = [...workoutSchedules].sort((a, b) => {
    const [hA = 0, mA = 0] = a.startTime.split(':').map(Number);
    const [hB = 0, mB = 0] = b.startTime.split(':').map(Number);

    const timeA = (a.dayOfWeek * 24 * 60 + hA * 60 + mA - currentTotalMinutes + weekMinutes) % weekMinutes;
    const timeB = (b.dayOfWeek * 24 * 60 + hB * 60 + mB - currentTotalMinutes + weekMinutes) % weekMinutes;

    return (timeA || weekMinutes) - (timeB || weekMinutes);
  })[0];

  return { workoutSplitId: next.workoutSplitId, dayOfWeek: next.dayOfWeek, startTime: next.startTime };
};
