import type { ExerciseInWorkoutHistory } from '../../../features/workouts/history/types/workout-history.types';

export type ExercisePerformanceEntry = {
  workoutDate: string;
  exerciseTracking: ExerciseInWorkoutHistory;
};

export type ExercisePerformanceByAssignmentId = {
  byExerciseToSplitId: Record<
    string,
    {
      exerciseTracked: ExercisePerformanceEntry[];
    }
  >;
};
