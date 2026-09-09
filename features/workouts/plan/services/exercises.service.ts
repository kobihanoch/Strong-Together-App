import { ListExercisesResponse } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';

export const getExerciseCollection = async (): Promise<ListExercisesResponse> => {
  const { data } = await api.get<ListExercisesResponse>('/api/exercises');
  return data;
};
