import { DateTime } from 'luxon';
import type { WorkoutSplit } from '../types/workout-plan.types';
import type { ExercisePerformanceByAssignmentId } from '../types/exercise-performance.types';

export const createMockExercisePerformance = (splits: WorkoutSplit[]): ExercisePerformanceByAssignmentId => {
  const workoutDate = DateTime.now().minus({ days: 4 }).toISODate() ?? '';

  return {
    byExerciseToSplitId: Object.fromEntries(
      splits.flatMap((split) =>
        split.exercises.map((exercise) => [
          String(exercise.exerciseToSplitId),
          {
            exerciseTracked: [
              {
                workoutDate,
                exerciseTracking: {
                  exerciseTrackingId: -exercise.exerciseToSplitId,
                  sets: exercise.sets.map((set, index) => ({
                    setIndex: set.orderIndex,
                    weight: Math.max(5, 20 + ((exercise.exerciseId + index) % 8) * 5),
                    reps: set.reps,
                  })),
                  notes: null,
                  exerciseAssignment: {
                    exerciseToSplitId: exercise.exerciseToSplitId,
                    orderIndex: exercise.orderIndex,
                    exerciseId: exercise.exerciseId,
                    workoutSplitId: split.id,
                    workoutSplitName: split.name,
                    exerciseName: exercise.name,
                    targetMuscle: exercise.targetMuscle,
                    specificTargetMuscle: exercise.specificTargetMuscle,
                  },
                },
              },
            ],
          },
        ]),
      ),
    ),
  };
};
