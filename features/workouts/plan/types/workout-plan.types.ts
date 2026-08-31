import { GetAllExercisesResponse, GetWholeUserWorkoutPlanResponse } from '@strong-together/shared';

export type WorkoutPlan = NonNullable<GetWholeUserWorkoutPlanResponse['workoutPlan']>;
export type WorkoutSplit = NonNullable<WorkoutPlan['workoutSplits']>[number];
export type ExerciseInPlan = WorkoutSplit['exercises'][number];
export type ExerciseAssignment = ExerciseInPlan;

export type ExercisesByMuscle = GetAllExercisesResponse;
type ExerciseLibraryItem = ExercisesByMuscle[string][number];
export type Exercise = ExerciseLibraryItem & { targetMuscle: string };
