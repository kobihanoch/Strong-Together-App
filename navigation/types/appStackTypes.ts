import { WorkoutSplit } from '../../features/workouts/plan/types/workout-plan.types';

export type RootParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: undefined;
  MyWorkoutPlan: undefined;
  CreateWorkout: undefined;
  TrackHistory: undefined;
  Inbox: undefined;
  WorkoutSession: {
    workoutSplit: WorkoutSplit;
  };
};
