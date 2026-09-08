import { RefreshTokenResponse } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';
import { setAccessToken } from '../utils/auth.utils';
import { getRefreshToken, saveRefreshToken, saveUserId } from '../utils/token-storage.utils';

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

/**
 * Runs the complete refresh-token rotation as one shared transaction.
 * Startup validation and every 401 retry join this same promise so a rotating
 * refresh token can never be consumed concurrently by two client requests.
 */
export const refreshSessionOnce = (): Promise<RefreshTokenResponse> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No stored refresh token');

    const { data } = await api.post<RefreshTokenResponse>('/api/auth/refresh', null, {
      headers: { 'x-refresh-token': `DPoP ${refreshToken}` },
    });

    // Do not release waiting requests until the rotated credentials are both
    // persisted and active on the shared API client.
    await Promise.all([saveRefreshToken(data.refreshToken), saveUserId(data.userId)]);
    setAccessToken(data.accessToken);
    return data;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

export const logoutUser = async (): Promise<void> => {
  const refreshToken = await getRefreshToken();
  await api.post(
    '/api/auth/logout',
    {},
    {
      headers: {
        'x-refresh-token': `DPoP ${refreshToken}`,
      },
      timeout: 5_000,
    },
  );
};
