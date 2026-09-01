import { GetWorkoutPlanResponse } from '@strong-together/shared';

export type WorkoutPlan = NonNullable<GetWorkoutPlanResponse['workoutPlan']>;
export type WorkoutSplit = NonNullable<WorkoutPlan['workoutSplits']>[number];
export type ExerciseInPlan = WorkoutSplit['exercises'][number];
