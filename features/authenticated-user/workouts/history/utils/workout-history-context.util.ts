import { DateTime } from 'luxon';
import { WorkoutHistoryAnalyzedExerciseTrackingData } from '../types/workout-history.types';
import { GetExerciseTrackingResponse } from '@strong-together/shared';

type ETUnpacked = WorkoutHistoryAnalyzedExerciseTrackingData;

export const unpackFromExerciseTrackingData = (
  exerciseTrackingData: GetExerciseTrackingResponse['exerciseTrackingAnalysis'],
): ETUnpacked => {
  const pr = exerciseTrackingData.prs.pr_max;
  return {
    //prMapExId: exerciseTrackingData.prs.pr_map_exercise_id,
    pr: {
      maxReps: pr?.reps || 0,
      maxWeight: pr?.weight || 0,
      maxExercise: pr?.exercise || null,
      maxDate: pr?.workout_time_utc || '',
    },
    workoutCount: exerciseTrackingData.unique_days,
    mostFrequentSplit: {
      splitName: exerciseTrackingData.most_frequent_split,
      times: exerciseTrackingData.most_frequent_split_days,
      //id: exerciseTrackingData.most_frequent_split_id,
    },
    lastWorkoutDate: exerciseTrackingData.lastWorkoutDate,
    splitDaysByName: exerciseTrackingData.splitDaysByName,
  };
};

export const checkHasTrainedToday = (
  lastWorkoutDate: string | null | undefined,
  tz: string = 'Asia/Jerusalem',
): boolean => {
  if (!lastWorkoutDate) return false;
  return lastWorkoutDate === DateTime.now().setZone(tz).toISODate(); // '2025-08-28'
};

