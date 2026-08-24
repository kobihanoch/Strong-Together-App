import { DateTime } from 'luxon';
import { WorkoutHistoryAnalyzedExerciseTrackingData } from '../types/workout-history.types';
import type { GetExerciseTrackingResponse } from '@strong-together/shared';

type ETUnpacked = WorkoutHistoryAnalyzedExerciseTrackingData;

export const unpackFromExerciseTrackingData = (
  exerciseTrackingData: GetExerciseTrackingResponse['exerciseTrackingAnalysis'] | undefined,
): ETUnpacked | undefined => {
  if (exerciseTrackingData === undefined) return undefined;
  const pr = exerciseTrackingData.prs.prMax;
  return {
    //prMapExId: exerciseTrackingData.prs.pr_map_exerciseId,
    pr: {
      maxReps: pr?.reps || 0,
      maxWeight: pr?.weight || 0,
      maxExercise: pr?.exercise || null,
      maxDate: pr?.workoutTimeUtc || '',
    },
    workoutCount: exerciseTrackingData.uniqueDays,
    mostFrequentSplit: {
      splitName: exerciseTrackingData.mostFrequentSplit,
      times: exerciseTrackingData.mostFrequentSplitDays,
      //id: exerciseTrackingData.mostFrequentSplit_id,
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
