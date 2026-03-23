import { ExerciseToWorkoutSplitEntity } from '../../types/entities/exerciseToWorkoutSplit.entity';
import { ExerciseEntity } from '../../types/entities/exercise.entity';
import { WorkoutSplitEntity } from '../../types/entities/workoutSplit.entity';

export interface ExerciseCandidate {
  id: ExerciseEntity['id'];
  name: ExerciseEntity['name'];
}

export interface SelectedExercise extends ExerciseCandidate {
  sets: NonNullable<ExerciseToWorkoutSplitEntity['sets']>;
  order_index: NonNullable<ExerciseToWorkoutSplitEntity['order_index']>;
}

export type SelectedExercises = Record<NonNullable<WorkoutSplitEntity['name']>, SelectedExercise[]>;
