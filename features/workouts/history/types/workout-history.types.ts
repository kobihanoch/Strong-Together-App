import { GetExerciseTrackingResponse } from '@strong-together/shared';

export interface WorkoutHistoryAnalyzedExerciseTrackingData {
  // Unpacked
  pr: {
    maxReps: Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['prMax'], null>['reps'];
    maxWeight: Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['prMax'], null>['weight'];
    maxExercise:
      | Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['prMax'], null>['exercise']
      | null;
    maxDate: Exclude<
      GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['prMax'],
      null
    >['workoutTimeUtc'];
  };
  workoutCount: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['uniqueDays'];
  mostFrequentSplit: {
    splitName: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['mostFrequentSplit'];
    times: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['mostFrequentSplitDays'];
  };
  lastWorkoutDate: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['lastWorkoutDate'];
  splitDaysByName: GetExerciseTrackingResponse['exerciseTrackingAnalysis']['splitDaysByName'];
}

export type WorkoutHistoryExerciseTrackingMaps = GetExerciseTrackingResponse['exerciseTrackingMaps'];
