import { WorkoutPlanSplit } from '../../../workouts/plan/types/workout-plan.types';
import { ResumeWorkoutCachePayload } from '../../../workouts/session/types/use-start-workout.types';

export type RootParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: undefined;
  MyWorkoutPlan: undefined;
  CreateWorkout: undefined;
  Statistics: undefined;
  Inbox: undefined;
  Analytics: undefined;
  StartWorkout: {
    workoutSplit: WorkoutPlanSplit;
    resumedWorkout?: Omit<ResumeWorkoutCachePayload, 'selectedSplit'>;
  };
};

