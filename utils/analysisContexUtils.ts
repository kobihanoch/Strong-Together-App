import { DateTime } from 'luxon';
import { GetExerciseTrackingResponse } from '../types/api/workouts/responses';

type etDataUnpacked = {
  pr: {
    maxReps: Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['pr_max'], null>['reps'];
    maxWeight: Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['pr_max'], null>['weight'];
    maxExercise: Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['pr_max'], null>['exercise'];
    maxDate: Exclude<
      GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['pr_max'],
      null
    >['workout_time_utc'];
  };
  workoutCount: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['unique_days'];
  mostFrequentSplit: {
    splitName: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['most_frequent_split'];
    times: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['most_frequent_split_days'];
  };
  lastWorkoutDate: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['lastWorkoutDate'];
  splitDaysByName: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['splitDaysByName'];
};

export const unpackFromExerciseTrackingData = (
  exerciseTrackingData: GetExerciseTrackingResponse['exerciseTrackingAnalysis'],
): etDataUnpacked => {
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

export const checkHasTrainedToday = (lastWorkoutDate: string, tz: string = 'Asia/Jerusalem'): boolean => {
  if (!lastWorkoutDate) return false;
  return lastWorkoutDate === DateTime.now().setZone(tz).toISODate(); // '2025-08-28'
};
