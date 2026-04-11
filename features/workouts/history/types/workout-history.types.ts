import { GetExerciseTrackingResponse } from '@strong-together/shared';
import { ExerciseTrackingAndStats } from '@strong-together/shared';

export interface WorkoutHistoryAnalyzedExerciseTrackingData {
  // Unpacked
  pr: {
    maxReps: Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['pr_max'], null>['reps'];
    maxWeight: Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['pr_max'], null>['weight'];
    maxExercise:
      | Exclude<GetExerciseTrackingResponse['exerciseTrackingAnalysis']['prs']['pr_max'], null>['exercise']
      | null;
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
}

export type WorkoutHistoryExerciseTrackingMaps = ExerciseTrackingAndStats['exerciseTrackingMaps'];
