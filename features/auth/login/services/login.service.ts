import api from '../../../../infrastructure/api/api-config/api';
import {
  UpdateUnverifiedAccountEmailBody,
  GetVerificationStatusQuery,
  LoginRequestBody,
  CreatePasswordResetRequestBody,
  CreateVerificationEmailBody,
} from '@strong-together/shared';
import { LoginResponse } from '@strong-together/shared';

export const loginUser = async (
  identifier: LoginRequestBody['identifier'],
  password: LoginRequestBody['password'],
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>(
      '/api/auth/login',
      {
        identifier,
        password,
      } satisfies LoginRequestBody,
      { apiMode: 'guest' },
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const changeEmail = async (
  username: UpdateUnverifiedAccountEmailBody['username'],
  password: UpdateUnverifiedAccountEmailBody['password'],
  newEmail: UpdateUnverifiedAccountEmailBody['newEmail'],
): Promise<void> => {
  await api.patch(
    '/api/auth/unverified-account/email',
    {
      username,
      password,
      newEmail,
    } satisfies UpdateUnverifiedAccountEmailBody,
    { apiMode: 'guest' },
  );
};

export const forgotPassword = async (identifier: CreatePasswordResetRequestBody['identifier']): Promise<void> => {
  await api.post('/api/auth/password-reset-requests', { identifier } satisfies CreatePasswordResetRequestBody, { apiMode: 'guest' });
};

export const checkUserVerify = async (username: GetVerificationStatusQuery['username']): Promise<{ isVerified: boolean }> => {
  const { data } = await api.get<{ isVerified: boolean }>(`/api/auth/verification-status`, {
    params: {
      username,
    } satisfies GetVerificationStatusQuery,
    apiMode: 'guest',
  });
  return data;
};

export const sendVerificationMail = async (email: CreateVerificationEmailBody['email']) => {
  await api.post('/api/auth/verification-emails', { email } satisfies CreateVerificationEmailBody, { apiMode: 'guest' });
};
