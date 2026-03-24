import { ExerciseToWorkoutSplitEntity } from '../../types/entities/exerciseToWorkoutSplit.entity';
import { ExerciseEntity } from '../../types/entities/exercise.entity';
import { WorkoutSplitEntity } from '../../types/entities/workoutSplit.entity';
import { ExercisesMapByMuscle, GetAllExercisesExercise } from '../../types/dto/exercises.dto';

export interface ExerciseCandidate {
  id: ExerciseEntity['id'];
  name: ExerciseEntity['name'];
}

export interface SelectedExercise extends ExerciseCandidate {
  sets: NonNullable<ExerciseToWorkoutSplitEntity['sets']>;
  order_index: NonNullable<ExerciseToWorkoutSplitEntity['order_index']>;
}

export type SelectedExercises = Record<NonNullable<WorkoutSplitEntity['name']>, SelectedExercise[]>;

// Return types ----------------------------------------------------------------------------------------

export interface CreateWorkoutControls {
  addExercise: (exercise: ExerciseCandidate) => void;
  addSplit: () => void;
  updateSets: (exercise: ExerciseCandidate, updatedSetsArr: NonNullable<ExerciseToWorkoutSplitEntity['sets']>) => void;
  removeExercise: (exercise: ExerciseCandidate) => void;
  removeSplit: (splitName: NonNullable<WorkoutSplitEntity['name']>) => void;
  onDragEnd: (params: { data: SelectedExercise[] }) => void;
}

export interface CreateWorkoutLoadings {
  isSaving: boolean;
  exLoading: boolean;
}

export interface UseCreateWorkoutLogicReturn {
  selectedExercises: SelectedExercises;
  splitsList: string[];
  availableExercises: ExercisesMapByMuscle;
  allExercises: (GetAllExercisesExercise & { targetmuscle: ExerciseEntity['targetmuscle'] })[];
  muscles: string[];
  saveWorkout: () => Promise<void>;
  controls: CreateWorkoutControls;
  loadings: CreateWorkoutLoadings;
  hasWorkout: boolean;
  setSelectedSplit: React.Dispatch<React.SetStateAction<NonNullable<WorkoutSplitEntity['name']>>>;
  exerciseCountMap: Record<NonNullable<WorkoutSplitEntity['name']>, number>;
  totalExercises: number;
  selectedSplit: NonNullable<WorkoutSplitEntity['name']>;
  exForSplit: SelectedExercise[];
}
