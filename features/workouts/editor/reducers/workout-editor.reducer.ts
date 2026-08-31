import type { AddWorkoutBody } from '@strong-together/shared';

export type WorkoutData = AddWorkoutBody['workoutData'];

export type EditorState = {
  splits: WorkoutData;
  selectedSplitIndex: number;
  expandedExerciseId: number | null;
  isDirty: boolean;
};

export type EditorAction =
  | { type: 'initialize'; splits: WorkoutData }
  | { type: 'selectSplit'; index: number }
  | { type: 'addSplit' }
  | { type: 'removeSplit' }
  | { type: 'renameSplit'; name: string }
  | { type: 'toggleExercise'; exerciseId: number }
  | { type: 'addExercise'; exerciseId: number }
  | { type: 'removeExercise'; exerciseId: number }
  | { type: 'reorderExercises'; exercises: WorkoutData[number]['exercises'] }
  | { type: 'updateSetCount'; exerciseId: number; count: number }
  | { type: 'updateRep'; exerciseId: number; setIndex: number; reps: number }
  | { type: 'markSaved' };

export const initialEditorState: EditorState = {
  splits: [],
  selectedSplitIndex: 0,
  expandedExerciseId: null,
  isDirty: false,
};

// Applies a change only to the currently selected split.
const updateSelectedSplit = (state: EditorState, update: (split: WorkoutData[number]) => WorkoutData[number]): EditorState => ({
  ...state,
  splits: state.splits.map((split, index) => (index === state.selectedSplitIndex ? update(split) : split)),
  isDirty: true,
});

export const workoutEditorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'initialize':
      return { ...initialEditorState, splits: action.splits };
    case 'selectSplit':
      return { ...state, selectedSplitIndex: action.index, expandedExerciseId: null };
    case 'addSplit': {
      const index = state.splits.length;
      return {
        ...state,
        splits: [...state.splits, { name: `Split ${String.fromCharCode(65 + index)}`, orderIndex: index, exercises: [] }],
        selectedSplitIndex: index,
        expandedExerciseId: null,
        isDirty: true,
      };
    }
    case 'removeSplit': {
      const splits = state.splits
        .filter((_, index) => index !== state.selectedSplitIndex)
        .map((split, orderIndex) => ({ ...split, orderIndex }));
      return { ...state, splits, selectedSplitIndex: Math.min(state.selectedSplitIndex, splits.length - 1), expandedExerciseId: null, isDirty: true };
    }
    case 'renameSplit':
      return updateSelectedSplit(state, (split) => ({ ...split, name: action.name }));
    case 'toggleExercise':
      return { ...state, expandedExerciseId: state.expandedExerciseId === action.exerciseId ? null : action.exerciseId };
    case 'addExercise':
      return {
        ...updateSelectedSplit(state, (split) => ({
          ...split,
          exercises: [...split.exercises, { exerciseId: action.exerciseId, sets: [10, 10, 10], orderIndex: split.exercises.length }],
        })),
        expandedExerciseId: action.exerciseId,
      };
    case 'removeExercise':
      return {
        ...updateSelectedSplit(state, (split) => ({
          ...split,
          exercises: split.exercises
            .filter((exercise) => exercise.exerciseId !== action.exerciseId)
            .map((exercise, orderIndex) => ({ ...exercise, orderIndex })),
        })),
        expandedExerciseId: null,
      };
    case 'reorderExercises':
      return updateSelectedSplit(state, (split) => ({
        ...split,
        exercises: action.exercises.map((exercise, orderIndex) => ({ ...exercise, orderIndex })),
      }));
    case 'updateSetCount':
      return updateSelectedSplit(state, (split) => ({
        ...split,
        exercises: split.exercises.map((exercise) => {
          if (exercise.exerciseId !== action.exerciseId) return exercise;
          const sets = [...exercise.sets];
          while (sets.length < action.count) sets.push(sets.at(-1) ?? 10);
          return { ...exercise, sets: sets.slice(0, action.count) };
        }),
      }));
    case 'updateRep':
      return updateSelectedSplit(state, (split) => ({
        ...split,
        exercises: split.exercises.map((exercise) =>
          exercise.exerciseId === action.exerciseId
            ? { ...exercise, sets: exercise.sets.map((reps, index) => (index === action.setIndex ? Math.max(1, action.reps) : reps)) }
            : exercise,
        ),
      }));
    case 'markSaved':
      return { ...state, isDirty: false };
  }
};
