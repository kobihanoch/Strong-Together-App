import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { saveWorkoutSession } from '../services/workout-session.service';
import { clearWorkoutSessionStorage } from '../utils/workout-session-cache.utils';
import { useWorkoutSessionStore } from './use-workout-session-store.hook';

/**
 * Orchestrates the local workout-session draft and its server mutation.
 * A successful save clears the persisted draft and invalidates every server cache
 * affected by the completed workout; a failed save leaves the draft available to retry.
 *
 * @returns The active draft, saving state, mutation error, and workout-session actions.
 */
export const useWorkoutSession = () => {
  const { userIdCache: userId } = useAuth();
  const queryClient = useQueryClient();

  const draft = useWorkoutSessionStore((state) => state.draft);
  const workoutSplit = useWorkoutSessionStore((state) => state.workoutSplit);
  const progress = useWorkoutSessionStore((state) => state.progress);

  // Creates a new persisted workout draft and its session context.
  const startWorkout = useWorkoutSessionStore((state) => state.startWorkout);
  // Adds an unplanned exercise to the active draft.
  const addExercise = useWorkoutSessionStore((state) => state.addExercise);
  // Removes an exercise that was added during the active workout.
  const removeExercise = useWorkoutSessionStore((state) => state.removeExercise);
  // Reorders exercises without detaching their sets, notes, or completion state.
  const reorderExercises = useWorkoutSessionStore((state) => state.reorderExercises);
  // Appends an extra set to an exercise.
  const addSet = useWorkoutSessionStore((state) => state.addSet);
  // Removes an extra set from an exercise.
  const removeSet = useWorkoutSessionStore((state) => state.removeSet);
  // Persists weight or reps changes for an existing set.
  const updateSet = useWorkoutSessionStore((state) => state.updateSet);
  // Persists an exercise note.
  const updateNotes = useWorkoutSessionStore((state) => state.updateNotes);
  // Persists which exercise is currently visible.
  const setActiveExercise = useWorkoutSessionStore((state) => state.setActiveExercise);
  // Persists which set is currently selected.
  const setActiveSet = useWorkoutSessionStore((state) => state.setActiveSet);
  // Marks a set performed and starts/replaces elapsed rest tracking.
  const completeSet = useWorkoutSessionStore((state) => state.completeSet);
  // Stops the current elapsed rest measurement.
  const finishRest = useWorkoutSessionStore((state) => state.finishRest);
  // Adds the workout end timestamp before submission.
  const finishWorkout = useWorkoutSessionStore((state) => state.finishWorkout);
  // Clears the active workout from memory and persisted storage state.
  const resetWorkout = useWorkoutSessionStore((state) => state.resetWorkout);

  const saveMutation = useMutation({
    mutationFn: saveWorkoutSession,
    onSuccess: async () => {
      resetWorkout();
      await clearWorkoutSessionStorage();

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workout-history', userId] }),
        queryClient.invalidateQueries({ queryKey: ['exercise-history', userId] }),
        queryClient.invalidateQueries({ queryKey: ['pr-history', userId] }),
        queryClient.invalidateQueries({ queryKey: ['home-dashboard', userId] }),
      ]);
    },
  });

  // Finalizes and submits the current draft; failed submissions keep it available for retry.
  const saveWorkout = async (): Promise<void> => {
    if (!userId) throw new Error('User is not authenticated');
    if (!draft) throw new Error('There is no active workout to save');

    finishWorkout();
    const finishedDraft = useWorkoutSessionStore.getState().draft;
    if (!finishedDraft) throw new Error('There is no active workout to save');

    await saveMutation.mutateAsync(finishedDraft);
  };

  // Explicitly discards both the in-memory session and its AsyncStorage entry.
  const discardWorkout = async (): Promise<void> => {
    await clearWorkoutSessionStorage();
    resetWorkout();
  };

  return {
    data: { draft, workoutSplit, progress },
    loadingStates: { isSaving: saveMutation.isPending },
    error: saveMutation.error,
    actions: {
      startWorkout,
      addExercise,
      removeExercise,
      reorderExercises,
      addSet,
      removeSet,
      updateSet,
      updateNotes,
      setActiveExercise,
      setActiveSet,
      completeSet,
      finishRest,
      saveWorkout,
      discardWorkout,
      resetWorkout,
    },
  };
};
