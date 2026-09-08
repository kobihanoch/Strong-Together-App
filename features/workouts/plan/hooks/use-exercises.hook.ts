import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { getExerciseCollection } from '../services/exercises.service';
import { ExercisesByMuscle } from '../types/exercises.types';

/**
 * Loads the shared exercise library after the user session is server-validated.
 * The collection remains cached per authenticated user to support plan editing
 * and additions made during an active workout.
 *
 * @returns The muscle-grouped exercise collection, query loading states, and a manual refetch action.
 */
const useExercises = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();

  const query = useQuery({
    queryKey: ['exercises', userId],
    queryFn: async (): Promise<ExercisesByMuscle> => await getExerciseCollection(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Data
  const exercises = query.data;

  return {
    data: exercises,
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
    },
    actions: {
      refetch: query.refetch,
    },
  };
};

export default useExercises;
