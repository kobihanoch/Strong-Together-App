import api from '../../../../infrastructure/api/api-config/api';
import { GetAuthenticatedUserByIdResponse, RefreshTokenResponse } from '@strong-together/shared';
import { getRefreshToken } from '../utils/token-storage.utils';

// Fetch self data
export const fetchSelfUserData = async (): Promise<GetAuthenticatedUserByIdResponse> => {
  const { data } = await api.get<GetAuthenticatedUserByIdResponse>('/api/users/get');
  return data;
};

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
          'x-refresh-token': `DPoP ${refreshToken}`,
        },
        apiMode: 'guest',
      },
    );
  } catch (error) {
    throw error;
  }
};
