import { ExerciseInPlan, WholeUserWorkoutPlan, WorkoutSplitsMap } from '../../types/dto/workoutPlans.dto';
import { WorkoutSplitEntity } from '../../types/entities/workoutSplit.entity';

export type WorkoutContextCachePayload = {
  workoutPlan: WholeUserWorkoutPlan | null;
  workoutPlanForEditWorkout: WorkoutSplitsMap | null;
};

export interface WorkoutContextWorkoutSplit {
  name: NonNullable<WorkoutSplitEntity['name']>;
  id: WorkoutSplitEntity['id'];
  muscleGroup: WorkoutSplitEntity['muscle_group'];
}

export type WorkoutContextWorkoutPlan = WholeUserWorkoutPlan;

export type WorkoutPlanForEdit = WorkoutSplitsMap;

export interface WorkoutContextValue {
  workout: WorkoutContextWorkoutPlan | null;
  setWorkout: React.Dispatch<React.SetStateAction<WholeUserWorkoutPlan | null>>;
  workoutSplits: WorkoutContextWorkoutSplit[];
  exercises: Record<string, ExerciseInPlan[]>;
  workoutForEdit: WorkoutSplitsMap | null;
  setWorkoutForEdit: React.Dispatch<React.SetStateAction<WorkoutSplitsMap | null>>;
  loading: boolean;
}
