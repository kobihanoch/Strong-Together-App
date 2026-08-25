import { WorkoutPlan } from '../../../plan/types/workout-plan.types';
import { WorkoutSplitFullData } from '../../types/workout.types';

export interface WorkoutPlanProviderValue {
  workout: WorkoutPlan | null;
  setWorkout: React.Dispatch<React.SetStateAction<WorkoutPlan | null | undefined>>;
  workoutSplits: WorkoutSplitFullData[];
  loading: boolean;
}
