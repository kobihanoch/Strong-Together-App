import { WorkoutSplit } from '../../features/workouts/plan/types/workout-plan.types';

export type RootParamList = {
  Home: undefined;
  Profile: undefined;
  MyWorkoutPlan: undefined;
  WorkoutSchedules: undefined;
  CreateWorkout: undefined;
  TrackHistory: { date?: string } | undefined;
  Inbox: undefined;
  WorkoutSession: {
    workoutSplit: WorkoutSplit;
  };
  WorkoutSummary: {
    workoutName: string;
    durationSeconds: number;
    completedSets: number;
    extraSets: number;
    exercises: { exerciseId: number; name: string; sets: { weight: number; reps: number }[] }[];
  };
};
