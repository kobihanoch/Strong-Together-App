import { ExercisesMapByMuscle } from '../../types/dto/exercises.dto';
import { ExerciseEntity } from '../../types/entities/exercise.entity';
import { ExerciseToWorkoutSplitEntity } from '../../types/entities/exerciseToWorkoutSplit.entity';
import { WorkoutSplitEntity } from '../../types/entities/workoutSplit.entity';

export interface ExerciseCandidate {
  id: ExerciseEntity['id'];
  name: ExerciseEntity['name'];
  targetmuscle: ExerciseEntity['targetmuscle'];
  specificTargetMuscle: ExerciseEntity['specifictargetmuscle'];
}

export interface SelectedExercise extends ExerciseCandidate {
  // Chosen exercise
  sets: NonNullable<ExerciseToWorkoutSplitEntity['sets']>;
  order_index: NonNullable<ExerciseToWorkoutSplitEntity['order_index']>;
}

export type SelectedExercises = Record<NonNullable<WorkoutSplitEntity['name']>, SelectedExercise[]>; // ALl workout plan

// Return types ----------------------------------------------------------------------------------------

export interface CreateWorkoutControls {
  addExercise: (exercise: ExerciseCandidate) => void;
  addSplit: () => void;
  updateSets: (exercise: SelectedExercise, updatedSetsArr: NonNullable<ExerciseToWorkoutSplitEntity['sets']>) => void;
  removeExercise: (exercise: SelectedExercise) => void;
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
  allExercises: ExerciseCandidate[];
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
