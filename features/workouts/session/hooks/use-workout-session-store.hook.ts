import type { CreateWorkoutSessionBody } from '@strong-together/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Exercise } from '../../plan/types/exercises.types';
import type { WorkoutSplit } from '../../plan/types/workout-plan.types';
import { WORKOUT_SESSION_CACHE_VERSION, WORKOUT_SESSION_STORAGE_KEY, workoutSessionStorage } from '../utils/workout-session-cache.utils';

type WorkoutEntry = CreateWorkoutSessionBody['workout'][number];
type TrackedSet = WorkoutEntry['trackedSets'][number];

export type WorkoutSessionProgress = {
  activeExerciseIndex: number;
  activeSetIndex: number;
  completedSetKeys: string[];
  rest: { startedAtUtc: string; exerciseName: string } | null;
};

const initialProgress: WorkoutSessionProgress = {
  activeExerciseIndex: 0,
  activeSetIndex: 0,
  completedSetKeys: [],
  rest: null,
};

type WorkoutSessionStore = {
  draft: CreateWorkoutSessionBody | null;
  workoutSplit: WorkoutSplit | null;
  progress: WorkoutSessionProgress;
  startWorkout: (workout: WorkoutEntry[], workoutSplit: WorkoutSplit) => void;
  setWorkoutSplit: (workoutSplit: WorkoutSplit) => void;
  addExercise: (exerciseId: Exercise['id']) => void;
  removeExercise: (exerciseId: Exercise['id']) => void;
  addSet: (workoutIndex: number, trackedSet: TrackedSet) => void;
  removeSet: (workoutIndex: number, setIndex: TrackedSet['setIndex'], setKey: string) => void;
  updateSet: (workoutIndex: number, trackedSet: TrackedSet) => void;
  updateNotes: (workoutIndex: number, notes: Exclude<WorkoutEntry['notes'], undefined>) => void;
  setActiveExercise: (workoutIndex: number) => void;
  setActiveSet: (setIndex: number) => void;
  completeSet: (setKey: string, exerciseName: string) => void;
  finishRest: () => void;
  finishWorkout: () => void;
  resetWorkout: () => void;
};

/**
 * Holds the active workout draft and persists it to AsyncStorage after each change.
 * The persisted start timestamp allows elapsed time to be calculated after the app
 * has been backgrounded, closed, or restarted.
 */
export const useWorkoutSessionStore = create<WorkoutSessionStore>()(
  persist(
    (set) => ({
      draft: null,
      workoutSplit: null,
      progress: initialProgress,

      startWorkout: (workout: WorkoutEntry[], workoutSplit: WorkoutSplit) =>
        set({
          draft: {
            workout,
            workoutStartUtc: new Date().toISOString(),
            workoutEndUtc: null,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          workoutSplit,
          progress: initialProgress,
        }),

      setWorkoutSplit: (workoutSplit: WorkoutSplit) => set({ workoutSplit }),

      // Exercises added during a session use exerciseId, not exerciseToSplitId.
      addExercise: (exerciseId: Exercise['id']) =>
        set((state) => {
          if (!state.draft) return state;

          return {
            draft: {
              ...state.draft,
              workout: [
                ...state.draft.workout,
                {
                  exerciseId,
                  exerciseToSplitId: null,
                  isExerciseAssignedToSplit: false,
                  notes: null,
                  trackedSets: [],
                },
              ],
            },
          };
        }),

      // Only exercises added during the session can be removed with this action.
      removeExercise: (exerciseId: Exercise['id']) =>
        set((state) =>
          state.draft
            ? {
                draft: {
                  ...state.draft,
                  workout: state.draft.workout.filter(
                    (exercise) => exercise.isExerciseAssignedToSplit || exercise.exerciseId !== exerciseId,
                  ),
                },
              }
            : state,
        ),

      addSet: (workoutIndex: number, trackedSet: TrackedSet) =>
        set((state) => {
          if (!state.draft) return state;

          const workout = [...state.draft.workout];
          const exercise = workout[workoutIndex];
          if (!exercise) return state;

          workout[workoutIndex] = {
            ...exercise,
            trackedSets: [...exercise.trackedSets, trackedSet],
          };

          return { draft: { ...state.draft, workout } };
        }),

      removeSet: (workoutIndex: number, setIndex: TrackedSet['setIndex'], setKey: string) =>
        set((state) => {
          if (!state.draft) return state;
          const workout = [...state.draft.workout];
          const exercise = workout[workoutIndex];
          if (!exercise) return state;

          workout[workoutIndex] = {
            ...exercise,
            trackedSets: exercise.trackedSets.filter((trackedSet) => trackedSet.setIndex !== setIndex),
          };
          return {
            draft: { ...state.draft, workout },
            progress: {
              ...state.progress,
              completedSetKeys: state.progress.completedSetKeys.filter((key) => key !== setKey),
            },
          };
        }),

      updateSet: (workoutIndex: number, trackedSet: TrackedSet) =>
        set((state) => {
          if (!state.draft) return state;

          const workout = [...state.draft.workout];
          const exercise = workout[workoutIndex];
          if (!exercise) return state;

          const trackedSets = [...exercise.trackedSets];
          const trackedSetIndex = trackedSets.findIndex((setItem) => setItem.setIndex === trackedSet.setIndex);
          if (trackedSetIndex === -1) return state;

          trackedSets[trackedSetIndex] = trackedSet;
          workout[workoutIndex] = { ...exercise, trackedSets };

          return { draft: { ...state.draft, workout } };
        }),

      updateNotes: (workoutIndex: number, notes: Exclude<WorkoutEntry['notes'], undefined>) =>
        set((state) => {
          if (!state.draft) return state;

          const workout = [...state.draft.workout];
          const exercise = workout[workoutIndex];
          if (!exercise) return state;

          workout[workoutIndex] = { ...exercise, notes };
          return { draft: { ...state.draft, workout } };
        }),

      setActiveExercise: (workoutIndex: number) =>
        set((state) => ({ progress: { ...state.progress, activeExerciseIndex: workoutIndex, activeSetIndex: 0 } })),

      setActiveSet: (setIndex: number) => set((state) => ({ progress: { ...state.progress, activeSetIndex: setIndex } })),

      completeSet: (setKey: string, exerciseName: string) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedSetKeys: state.progress.completedSetKeys.includes(setKey)
              ? state.progress.completedSetKeys
              : [...state.progress.completedSetKeys, setKey],
            rest: { startedAtUtc: new Date().toISOString(), exerciseName },
          },
        })),

      finishRest: () => set((state) => ({ progress: { ...state.progress, rest: null } })),

      finishWorkout: () => set((state) => (state.draft ? { draft: { ...state.draft, workoutEndUtc: new Date().toISOString() } } : state)),

      resetWorkout: async () => set({ draft: null, workoutSplit: null, progress: initialProgress }),
    }),
    {
      name: WORKOUT_SESSION_STORAGE_KEY,
      version: WORKOUT_SESSION_CACHE_VERSION,
      storage: workoutSessionStorage,
      partialize: (state) => ({ draft: state.draft, workoutSplit: state.workoutSplit, progress: state.progress }),
      migrate: () => ({ draft: null, workoutSplit: null, progress: initialProgress }),
    },
  ),
);
