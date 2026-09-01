import { DateTime } from 'luxon';
import { WorkoutHistoryMap } from '../types/workout-history.types';

export const checkHasTrainedToday = (tz: string = 'Asia/Jerusalem', workoutHistoryMap: WorkoutHistoryMap | undefined): boolean => {
  if (!workoutHistoryMap) return false;
  const dates = Object.keys(workoutHistoryMap?.byDate ?? {});
  const latestWorkoutDate = dates.length > 0 ? dates.reduce((latest, date) => (date > latest ? date : latest)) : null;
  if (!latestWorkoutDate) return false;
  return latestWorkoutDate === DateTime.now().setZone(tz).toISODate(); // '2025-08-28'
};
export const checkHasVisibleHistory = (workoutHistoryMap: WorkoutHistoryMap | undefined) => {
  if (!workoutHistoryMap) return false;
  return Object.keys(workoutHistoryMap?.byDate ?? {}).length > 0;
};
