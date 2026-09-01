import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { getExerciseCollection } from '../services/exercises.service';
import { ExercisesByMuscle } from '../types/exercises.types';

/**
 * Provides exercise collection from db..
 * @returns The result produced by use exercises.
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
