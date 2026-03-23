import { WorkoutContextWorkoutSplit } from '../../context/types/workoutContextTypes.dto';
import { ResumeWorkoutCachePayload } from '../../hooks/types/useStartWorkoutTypes.dto';

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
    workoutSplit?: WorkoutContextWorkoutSplit;
    resumedWorkout?: ResumeWorkoutCachePayload;
  };
};
