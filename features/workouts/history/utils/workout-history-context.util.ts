import { DateTime } from 'luxon';

export const checkHasTrainedToday = (lastWorkoutDate: string | null | undefined, tz: string = 'Asia/Jerusalem'): boolean => {
  if (!lastWorkoutDate) return false;
  return lastWorkoutDate === DateTime.now().setZone(tz).toISODate(); // '2025-08-28'
};
