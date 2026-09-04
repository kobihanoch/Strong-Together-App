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
  const startWorkout = useWorkoutSessionStore((state) => state.startWorkout);
  const addExercise = useWorkoutSessionStore((state) => state.addExercise);
  const removeExercise = useWorkoutSessionStore((state) => state.removeExercise);
  const addSet = useWorkoutSessionStore((state) => state.addSet);
  const updateSet = useWorkoutSessionStore((state) => state.updateSet);
  const updateNotes = useWorkoutSessionStore((state) => state.updateNotes);
  const finishWorkout = useWorkoutSessionStore((state) => state.finishWorkout);
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

  const saveWorkout = async (): Promise<void> => {
    if (!userId) throw new Error('User is not authenticated');
    if (!draft) throw new Error('There is no active workout to save');

    finishWorkout();
    const finishedDraft = useWorkoutSessionStore.getState().draft;
    if (!finishedDraft) throw new Error('There is no active workout to save');

    await saveMutation.mutateAsync(finishedDraft);
  };

  return {
    data: { draft },
    loadingStates: { isSaving: saveMutation.isPending },
    error: saveMutation.error,
    actions: {
      startWorkout,
      addExercise,
      removeExercise,
      addSet,
      updateSet,
      updateNotes,
      saveWorkout,
      resetWorkout,
    },
  };
};
