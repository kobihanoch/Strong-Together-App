import api from '../../../../../infrastructure/api/api';
import { AddUserAerobicsBody, GetUserAerobicsQuery } from '@strong-together/shared';
import { UserAerobicsResponse } from '@strong-together/shared';

export const getUserCardio = async (): Promise<UserAerobicsResponse> => {
  const { data } = await api.get<UserAerobicsResponse>('/api/aerobics/get', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetUserAerobicsQuery,
  });
  return data;
};

export const logUserCardio = async (
  durationMins: AddUserAerobicsBody['record']['durationMins'],
  durationSec: AddUserAerobicsBody['record']['durationSec'],
  type: AddUserAerobicsBody['record']['type'],
) => {
  const { data } = await api.post('/api/aerobics/add', {
    record: {
      durationMins,
      durationSec,
      type,
    },
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  } satisfies AddUserAerobicsBody);
  return data;
};
