import { ExerciseInPlan } from '@strong-together/shared';
import { WorkoutPlan, WorkoutPlanForEdit, WorkoutPlanSplit } from '../../plan/types/workout-plan.types';

export type WorkoutPlanProviderCachePayload = {
  workoutPlan: WorkoutPlan | null;
  workoutPlanForEditWorkout: WorkoutPlanForEdit | null;
};

export interface WorkoutPlanProviderValue {
  workout: WorkoutPlan | null;
  setWorkout: React.Dispatch<React.SetStateAction<WorkoutPlan | null>>;
  workoutSplits: WorkoutPlanSplit[];
  exercises: Record<string, ExerciseInPlan[]>;
  workoutForEdit: WorkoutPlanForEdit | null;
  setWorkoutForEdit: React.Dispatch<React.SetStateAction<WorkoutPlanForEdit | null>>;
  loading: boolean;
}
