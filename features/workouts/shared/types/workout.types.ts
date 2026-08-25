import type {
  ExerciseRow,
  GetAllExercisesResponse,
  GetExerciseTrackingResponse,
  GetWholeUserWorkoutPlanResponse,
  WorkoutSplitRow,
} from '@strong-together/shared';

export type ExerciseInCollection = ExerciseRow;
export type WorkoutPlan = Exclude<GetWholeUserWorkoutPlanResponse['workoutPlan'], null>;
export interface WorkoutSplitMetaData {
  id: WorkoutSplitRow['id'];
  name: WorkoutSplitRow['name'];
  muscleGroup: NonNullable<WorkoutPlan['workoutSplits']>[number]['muscleGroup'];
  orderIndex: number;
}
export type WorkoutSplitFullData = NonNullable<WorkoutPlan['workoutSplits']>[number];
export type ExerciseInPlan = NonNullable<WorkoutPlan['workoutSplits']>[number]['exercises'][number];
export type TrackingMapItem = GetExerciseTrackingResponse['byExerciseToSplitId'][string][number];
export type ExercisesByMuscle = GetAllExercisesResponse;
export type ExercisePickerItem = ExercisesByMuscle[string][number];
