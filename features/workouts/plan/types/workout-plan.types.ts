import { ListExercisesResponse, GetWorkoutPlanResponse } from '@strong-together/shared';

export type WorkoutPlan = NonNullable<GetWorkoutPlanResponse['workoutPlan']>;
export type WorkoutSplit = NonNullable<WorkoutPlan['workoutSplits']>[number];
export type ExerciseInPlan = WorkoutSplit['exercises'][number];

export type ExercisesByMuscle = ListExercisesResponse;
type ExerciseLibraryItem = ExercisesByMuscle[string][number];
export type Exercise = ExerciseLibraryItem & { targetMuscle: string };
