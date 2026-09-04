import type { CreateWorkoutSessionBody } from '@strong-together/shared';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Exercise } from '../../plan/types/exercises.types';
import { WORKOUT_SESSION_CACHE_VERSION, WORKOUT_SESSION_STORAGE_KEY, workoutSessionStorage } from '../utils/workout-session-cache.utils';

type WorkoutEntry = CreateWorkoutSessionBody['workout'][number];
type TrackedSet = WorkoutEntry['trackedSets'][number];

type WorkoutSessionStore = {
  draft: CreateWorkoutSessionBody | null;
  startWorkout: (workout: WorkoutEntry[]) => void;
  addExercise: (exerciseId: Exercise['id']) => void;
  removeExercise: (exerciseId: Exercise['id']) => void;
  addSet: (workoutIndex: number, trackedSet: TrackedSet) => void;
  updateSet: (workoutIndex: number, trackedSet: TrackedSet) => void;
  updateNotes: (workoutIndex: number, notes: Exclude<WorkoutEntry['notes'], undefined>) => void;
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

      startWorkout: (workout: WorkoutEntry[]) =>
        set({
          draft: {
            workout,
            workoutStartUtc: new Date().toISOString(),
            workoutEndUtc: null,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),

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

      finishWorkout: () => set((state) => (state.draft ? { draft: { ...state.draft, workoutEndUtc: new Date().toISOString() } } : state)),

      resetWorkout: () => set({ draft: null }),
    }),
    {
      name: WORKOUT_SESSION_STORAGE_KEY,
      version: WORKOUT_SESSION_CACHE_VERSION,
      storage: workoutSessionStorage,
      partialize: (state) => ({ draft: state.draft }),
      migrate: () => ({ draft: null }),
    },
  ),
);
