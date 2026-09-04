import { WorkoutSplit } from '../../features/workouts/plan/types/workout-plan.types';
import { ResumeWorkoutCachePayload } from '../../screens/workout-session/types/use-start-workout.types';

export type RootParamList = {
  Home: undefined;
  Settings: undefined;
  Profile: undefined;
  MyWorkoutPlan: undefined;
  CreateWorkout: undefined;
  TrackHistory: undefined;
  Inbox: undefined;
  StartWorkout: {
    workoutSplit: WorkoutSplit;
    resumedWorkout?: Omit<ResumeWorkoutCachePayload, 'selectedSplit'>;
  };
};
