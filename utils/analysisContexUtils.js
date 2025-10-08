import { DateTime } from "luxon";

export const unpackFromExerciseTrackingData = (exerciseTrackingData) => {
  return {
    prMapExId: exerciseTrackingData.prs.pr_map_exercise_id,
    pr: {
      maxReps: exerciseTrackingData.prs.pr_max.reps,
      maxWeight: exerciseTrackingData.prs.pr_max.weight,
      maxExercise: exerciseTrackingData.prs.pr_max.exercise,
      maxDate: exerciseTrackingData.prs.pr_max.workout_time_utc,
    },
    workoutCount: exerciseTrackingData.unique_days,
    mostFrequentSplit: {
      splitName: exerciseTrackingData.most_frequent_split,
      times: exerciseTrackingData.most_frequent_split_days,
      id: exerciseTrackingData.most_frequent_split_id,
    },
    lastWorkoutDate: exerciseTrackingData.lastWorkoutDate,
    splitDaysByName: exerciseTrackingData.splitDaysByName,
  };
};

export const checkHasTrainedToday = (
  lastWorkoutDate,
  tz = "Asia/Jerusalem"
) => {
  if (!lastWorkoutDate) return false;
  return lastWorkoutDate === DateTime.now().setZone(tz).toISODate(); // '2025-08-28'
};
