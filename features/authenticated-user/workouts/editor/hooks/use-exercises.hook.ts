import { useEffect, useState } from 'react';
import api from '../../../../api/api';
import { ExercisesMapByMuscle } from '@strong-together/shared';

const useExercises = (): { exercises: ExercisesMapByMuscle; error: Error | null; loading: boolean } => {
  const [exercises, setExercises] = useState<ExercisesMapByMuscle>({});
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await api.get<ExercisesMapByMuscle>('/api/exercises/getall');
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


