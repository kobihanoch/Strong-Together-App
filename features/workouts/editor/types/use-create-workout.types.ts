import type { Exercise, ExercisesByMuscle, WorkoutSplit } from '../../shared/types/workout.types';

export type ExerciseCandidate = Pick<Exercise, 'id' | 'name' | 'targetMuscle' | 'specificTargetMuscle'>;

export interface SelectedExercise extends ExerciseCandidate {
  // Chosen exercise
  sets: number[];
  orderIndex: number;
}

export type SelectedExercises = Record<WorkoutSplit['name'], SelectedExercise[]>; // ALl workout plan

// Return types ----------------------------------------------------------------------------------------

export interface CreateWorkoutControls {
  addExercise: (exercise: ExerciseCandidate) => void;
  addSplit: () => void;
  updateSets: (exercise: SelectedExercise, updatedSetsArr: number[]) => void;
  removeExercise: (exercise: SelectedExercise) => void;
  removeSplit: (splitName: WorkoutSplit['name']) => void;
  onDragEnd: (params: { data: SelectedExercise[] }) => void;
}

interface CreateWorkoutLoadings {
  isSaving: boolean;
  exLoading: boolean;
}

export interface UseCreateWorkoutLogicReturn {
  selectedExercises: SelectedExercises;
  splitsList: string[];
  availableExercises: ExercisesByMuscle;
  allExercises: ExerciseCandidate[];
  muscles: string[];
  saveWorkout: () => Promise<void>;
  controls: CreateWorkoutControls;
  loadings: CreateWorkoutLoadings;
  hasWorkout: boolean;
  setSelectedSplit: React.Dispatch<React.SetStateAction<WorkoutSplit['name']>>;
  exerciseCountMap: Record<WorkoutSplit['name'], number>;
  totalExercises: number;
  selectedSplit: WorkoutSplit['name'];
  exForSplit: SelectedExercise[];
}


