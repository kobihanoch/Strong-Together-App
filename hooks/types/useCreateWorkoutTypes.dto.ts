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
  sets: ExerciseToWorkoutSplitEntity['sets'];
  order_index: ExerciseToWorkoutSplitEntity['order_index'];
}

export type SelectedExercises = Record<WorkoutSplitEntity['name'], SelectedExercise[]>; // ALl workout plan

// Return types ----------------------------------------------------------------------------------------

export interface CreateWorkoutControls {
  addExercise: (exercise: ExerciseCandidate) => void;
  addSplit: () => void;
  updateSets: (exercise: SelectedExercise, updatedSetsArr: ExerciseToWorkoutSplitEntity['sets']) => void;
  removeExercise: (exercise: SelectedExercise) => void;
  removeSplit: (splitName: WorkoutSplitEntity['name']) => void;
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
  setSelectedSplit: React.Dispatch<React.SetStateAction<WorkoutSplitEntity['name']>>;
  exerciseCountMap: Record<WorkoutSplitEntity['name'], number>;
  totalExercises: number;
  selectedSplit: WorkoutSplitEntity['name'];
  exForSplit: SelectedExercise[];
}
