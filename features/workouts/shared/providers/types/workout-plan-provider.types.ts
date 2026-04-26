import { ExerciseInPlan } from '@strong-together/shared';
import { WorkoutPlan, WorkoutPlanForEdit, WorkoutPlanSplit } from '../../../plan/types/workout-plan.types';

export interface WorkoutPlanProviderValue {
  workout: WorkoutPlan | null;
  setWorkout: React.Dispatch<React.SetStateAction<WorkoutPlan | null | undefined>>;
  workoutSplits: WorkoutPlanSplit[];
  exercises: Record<string, ExerciseInPlan[]>;
  workoutForEdit: WorkoutPlanForEdit | null | undefined;
  setWorkoutForEdit: React.Dispatch<React.SetStateAction<WorkoutPlanForEdit | null | undefined>>;
  loading: boolean;
}
