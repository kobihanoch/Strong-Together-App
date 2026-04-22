import { ExerciseInPlan, WholeUserWorkoutPlan, WorkoutSplitsMap } from '@strong-together/shared';
import { WorkoutSplitEntity } from '@strong-together/shared';

export interface WorkoutPlanSplit {
  name: WorkoutSplitEntity['name'];
  id: WorkoutSplitEntity['id'];
  muscleGroup: WorkoutSplitEntity['muscle_group'];
}

export type WorkoutPlan = WholeUserWorkoutPlan;

export type WorkoutPlanForEdit = WorkoutSplitsMap;

export type WorkoutPlanExercises = Record<string, ExerciseInPlan[]>;
