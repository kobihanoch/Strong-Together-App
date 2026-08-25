import { WorkoutSplit } from '../../features/workouts/shared/types/workout.types';
import { ResumeWorkoutCachePayload } from '../../features/workouts/session/types/use-start-workout.types';

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
    workoutSplit: WorkoutSplit;
    resumedWorkout?: Omit<ResumeWorkoutCachePayload, 'selectedSplit'>;
  };
};
