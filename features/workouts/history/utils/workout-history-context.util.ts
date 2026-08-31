import { DateTime } from 'luxon';
import { WorkoutHistoryExerciseTrackingMaps } from '../types/workout-history.types';

export const checkHasTrainedToday = (
  tz: string = 'Asia/Jerusalem',
  exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | undefined,
): boolean => {
  if (!exerciseTrackingMaps) return false;
  const dates = Object.keys(exerciseTrackingMaps?.byDate ?? {});
  const latestWorkoutDate = dates.length > 0 ? dates.reduce((latest, date) => (date > latest ? date : latest)) : null;
  if (!latestWorkoutDate) return false;
  return latestWorkoutDate === DateTime.now().setZone(tz).toISODate(); // '2025-08-28'
};
export const checkHasVisibleHistory = (exerciseTrackingMaps: WorkoutHistoryExerciseTrackingMaps | undefined) => {
  if (!exerciseTrackingMaps) return false;
  return Object.keys(exerciseTrackingMaps?.byDate ?? {}).length > 0;
};
