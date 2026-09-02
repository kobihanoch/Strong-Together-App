import { GetExerciseHistoryResponse, GetExerciseHistoryQuery } from '@strong-together/shared';
import api from '../../../../infrastructure/api/api-config/api';

export const getUserExerciseHistory = async (): Promise<GetExerciseHistoryResponse> => {
  const { data } = await api.get<GetExerciseHistoryResponse>(`/api/exercise-history`, {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetExerciseHistoryQuery,
  });
  return data;
};
