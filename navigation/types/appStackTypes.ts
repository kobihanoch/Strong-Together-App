import { WorkoutSplit } from '../../features/workouts/plan/types/workout-plan.types';
import { ResumeWorkoutCachePayload } from '../../screens/start-workout/types/use-start-workout.types';

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
