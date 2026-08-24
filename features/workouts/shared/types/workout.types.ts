import type {
  ExerciseRow,
  ExerciseToWorkoutSplitRow,
  GetAllExercisesResponse,
  GetExerciseTrackingResponse,
  GetWholeUserWorkoutPlanResponse,
  WorkoutSplitRow,
} from '@strong-together/shared';

export type Exercise = ExerciseRow;
export type ExerciseAssignment = ExerciseToWorkoutSplitRow;
export type WorkoutPlan = Exclude<GetWholeUserWorkoutPlanResponse['workoutPlan'], null>;
type WorkoutPlanResponseSplit = NonNullable<WorkoutPlan['workoutSplits']>[number];
export interface WorkoutPlanSplit {
  id: WorkoutSplit['id'];
  name: WorkoutSplit['name'];
  muscleGroup: WorkoutPlanResponseSplit['muscleGroup'];
}
export type ExerciseInPlan = WorkoutPlanResponseSplit['exerciseToWorkoutSplit'][number];
export type TrackingMapItem = GetExerciseTrackingResponse['exerciseTrackingMaps']['byExerciseToSplitId'][string][number];
export type WorkoutSplit = WorkoutSplitRow;
export type ExercisesByMuscle = GetAllExercisesResponse;
export type ExercisePickerItem = ExercisesByMuscle[string][number];
