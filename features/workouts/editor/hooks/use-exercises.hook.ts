import { useEffect, useState } from 'react';
import api from '../../../../infrastructure/api/api-config/api';
import { ExercisesByMuscle } from '../../shared/types/workout.types';

const useExercises = (): { exercises: ExercisesByMuscle; error: Error | null; loading: boolean } => {
  const [exercises, setExercises] = useState<ExercisesByMuscle>({});
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await api.get<ExercisesByMuscle>('/api/exercises/getall');
        setExercises(data);
      } catch (e) {
        //console.log(e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return { exercises, error, loading };
};

export default useExercises;
