import type {
  GetAllExercisesResponse,
  GetExerciseTrackingResponse,
  GetWholeUserWorkoutPlanResponse,
} from '@strong-together/shared';

export type WorkoutPlan = NonNullable<GetWholeUserWorkoutPlanResponse['workoutPlan']>;
export type WorkoutSplit = NonNullable<WorkoutPlan['workoutSplits']>[number];
export type ExerciseInPlan = WorkoutSplit['exercises'][number];
export type ExerciseAssignment = ExerciseInPlan;

export type ExercisesByMuscle = GetAllExercisesResponse;
type ExerciseLibraryItem = ExercisesByMuscle[string][number];
export type Exercise = ExerciseLibraryItem & { targetMuscle: string };

export type TrackingMapItem = GetExerciseTrackingResponse['byExerciseToSplitId'][string][number];

export interface WorkoutPlanProviderValue {
  workout: WorkoutPlan | null;
  setWorkout: React.Dispatch<React.SetStateAction<WorkoutPlan | null | undefined>>;
  workoutSplits: WorkoutSplit[];
  loading: boolean;
}
