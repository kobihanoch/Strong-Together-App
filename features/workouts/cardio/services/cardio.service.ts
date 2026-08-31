import api from '../../../../infrastructure/api/api-config/api';
import { AddUserAerobicsBody, GetUserAerobicsQuery } from '@strong-together/shared';
import { UserAerobicsResponse } from '@strong-together/shared';

export const getUserCardio = async (): Promise<UserAerobicsResponse> => {
  const { data } = await api.get<UserAerobicsResponse>('/api/aerobics/get', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetUserAerobicsQuery,
  });
  return data;
};

export const logUserCardio = async (payload: AddUserAerobicsBody['record']): Promise<UserAerobicsResponse> => {
  const { data } = await api.post<UserAerobicsResponse>('/api/aerobics/add', {
    record: {
      ...payload,
    },
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  } satisfies AddUserAerobicsBody);
  return data;
};
