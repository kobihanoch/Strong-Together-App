import api from '../../../../api/api';
import { RefreshTokenResponse } from '@strong-together/shared';
import { getRefreshToken } from '../../../../utils/tokenStore';

export const refreshAndRotateTokens = async () => {
  const rt = await getRefreshToken();
  if (!rt) throw new Error('No stored refresh token');

  const { data } = await api.post<RefreshTokenResponse>(`/api/auth/refresh`, null, {
    headers: { 'x-refresh-token': `DPoP ${rt}` },
  });
  return data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    const refreshToken = await getRefreshToken();
    await api.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          'x-refresh-token': `Bearer ${refreshToken}`,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};
