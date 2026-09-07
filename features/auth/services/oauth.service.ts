import { AppleOAuthBody, GoogleOAuthBody, OAuthLoginResponse } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

export const loginUserGoogle = async (idToken: GoogleOAuthBody['idToken']): Promise<OAuthLoginResponse> => {
  const { data } = await api.post<OAuthLoginResponse>('/api/oauth/google', { idToken } satisfies GoogleOAuthBody, { apiMode: 'guest' });
  return data;
};

export const loginUserApple = async (
  idToken: AppleOAuthBody['idToken'],
  rawNonce: AppleOAuthBody['rawNonce'],
  email: AppleOAuthBody['email'],
  name: AppleOAuthBody['name'],
): Promise<OAuthLoginResponse> => {
  const { data } = await api.post<OAuthLoginResponse>(
    '/api/oauth/apple',
    {
      idToken,
      rawNonce,
      email,
      name,
    } satisfies AppleOAuthBody,
    { apiMode: 'guest' },
  );
  return data;
};
