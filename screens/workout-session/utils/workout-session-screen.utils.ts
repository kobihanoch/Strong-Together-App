import type { CreateWorkoutSessionBody } from '@strong-together/shared';
import type { Exercise, ExercisesByMuscle } from '../../../features/workouts/plan/types/exercises.types';
import type { WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';

export type WorkoutEntry = CreateWorkoutSessionBody['workout'][number];
export type TrackedSet = WorkoutEntry['trackedSets'][number];

export type NavigatorExercise = {
  key: string;
  name: string;
  isAdded: boolean;
  completedSets: number;
  totalSets: number;
};

export const createWorkoutEntries = (workoutSplit: WorkoutSplit): WorkoutEntry[] =>
  workoutSplit.exercises.map((exercise) => ({
    exerciseId: null,
    exerciseToSplitId: exercise.exerciseToSplitId,
    isExerciseAssignedToSplit: true,
    notes: null,
    trackedSets: exercise.sets.map((set) => ({ setIndex: set.orderIndex, reps: 0, weight: 0 })),
  }));

export const getExerciseKey = (exercise: WorkoutEntry | null, fallbackIndex: number): string =>
  String(exercise?.exerciseToSplitId ?? `added-${exercise?.exerciseId ?? fallbackIndex}`);

export const flattenExercises = (collection: ExercisesByMuscle | undefined): Exercise[] =>
  Object.entries(collection ?? {}).flatMap(([targetMuscle, exercises]) =>
    exercises.map((exercise) => ({ ...exercise, targetMuscle })),
  );

export const filterExercises = (exercises: Exercise[], selectedMuscle: string, searchQuery: string): Exercise[] => {
  const query = searchQuery.trim().toLowerCase();
  return exercises.filter(
    (exercise) =>
      (selectedMuscle === 'All' || exercise.targetMuscle === selectedMuscle) &&
      (!query || exercise.name.toLowerCase().includes(query)),
  );
};

export const buildNavigatorExercises = (
  workout: WorkoutEntry[],
  workoutSplit: WorkoutSplit,
  exercisesById: Map<Exercise['id'], Exercise>,
  completedSetKeys: string[],
): NavigatorExercise[] =>
  workout.map((exercise, index) => {
    const plannedExercise = workoutSplit.exercises.find((item) => item.exerciseToSplitId === exercise.exerciseToSplitId);
    const key = getExerciseKey(exercise, index);
    return {
      key,
      name: plannedExercise?.name ?? exercisesById.get(exercise.exerciseId ?? -1)?.name ?? 'Added exercise',
      isAdded: !exercise.isExerciseAssignedToSplit,
      completedSets: exercise.trackedSets.filter((set) => completedSetKeys.includes(`${key}:${set.setIndex}`)).length,
      totalSets: exercise.trackedSets.length,
    };
  });

export const findNextIncompleteSetIndex = (
  sets: TrackedSet[],
  activeSetIndex: number,
  exerciseKey: string,
  completedSetKeys: string[],
): number =>
  sets.findIndex(
    (set, index) => index > activeSetIndex && !completedSetKeys.includes(`${exerciseKey}:${set.setIndex}`),
  );

export const getTotalSets = (workout: WorkoutEntry[]): number =>
  workout.reduce((total, exercise) => total + exercise.trackedSets.length, 0);

export const isExerciseAlreadyAdded = (
  exercise: Exercise,
  workout: WorkoutEntry[],
  workoutSplit: WorkoutSplit,
): boolean =>
  workout.some((item) => item.exerciseId === exercise.id) ||
  workoutSplit.exercises.some((planned) => planned.exerciseId === exercise.id);
