import type { ExerciseTrackingAndStats } from '../../dto/exerciseTracking.dto.ts';
import type { WholeUserWorkoutPlan, WorkoutSplitsMap } from '../../dto/workoutPlans.dto.ts';

export interface GetWholeUserWorkoutPlanResponse {
  workoutPlan: WholeUserWorkoutPlan | null;
  workoutPlanForEditWorkout?: WorkoutSplitsMap;
}

export type GetExerciseTrackingResponse = ExerciseTrackingAndStats;

export type FinishUserWorkoutResponse = ExerciseTrackingAndStats;

export interface AddWorkoutResponse {
  message: string;
  workoutPlan: WholeUserWorkoutPlan;
  workoutPlanForEditWorkout: WorkoutSplitsMap;
}
