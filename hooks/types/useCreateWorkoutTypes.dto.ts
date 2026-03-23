import { ExerciseToWorkoutSplitEntity } from '../../types/entities/exerciseToWorkoutSplit.entity';
import { ExerciseEntity } from '../../types/entities/exercise.entity';

export interface ExerciseCandidate {
  id: ExerciseEntity['id'];
  name: ExerciseEntity['name'];
}

export interface SelectedExercise extends ExerciseCandidate {
  sets: ExerciseToWorkoutSplitEntity['sets'];
  order_index: ExerciseToWorkoutSplitEntity['order_index'];
}
