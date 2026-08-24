import type { GetWholeUserWorkoutPlanResponse } from '@strong-together/shared';

export type { ExerciseInPlan, WorkoutPlan, WorkoutPlanSplit } from '../../shared/types/workout.types';

export type WorkoutPlanForEdit = Exclude<GetWholeUserWorkoutPlanResponse['workoutPlanForEditWorkout'], null>;
