import type { Exercise } from '../../../features/workouts/plan/types/workout-plan.types';

// Legacy types used only by the previous editor components that remain in the project.
export type ExerciseCandidate = Pick<Exercise, 'id' | 'name' | 'targetMuscle' | 'specificTargetMuscle'>;
export type SelectedExercise = ExerciseCandidate & { sets: number[]; orderIndex: number };
export type SelectedExercises = Record<string, SelectedExercise[]>;

export type CreateWorkoutControls = {
  addExercise: (exercise: ExerciseCandidate) => void;
  addSplit: () => void;
  updateSets: (exercise: SelectedExercise, sets: number[]) => void;
  removeExercise: (exercise: SelectedExercise) => void;
  removeSplit: (name: string) => void;
  onDragEnd: (params: { data: SelectedExercise[] }) => void;
};

export type UseCreateWorkoutLogicReturn = any;
