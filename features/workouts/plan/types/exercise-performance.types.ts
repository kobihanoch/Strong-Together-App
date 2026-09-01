import type { ExerciseInWorkoutHistory } from '../../history/types/workout-history.types';

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
