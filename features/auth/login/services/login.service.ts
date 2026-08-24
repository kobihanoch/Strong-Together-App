import api from '../../../../infrastructure/api/api-config/api';
import {
  ChangeEmailAndVerifyBody,
  CheckUserVerifyQuery,
  LoginRequestBody,
  SendChangePassEmailBody,
  SendVerificationMailBody,
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
  username: ChangeEmailAndVerifyBody['username'],
  password: ChangeEmailAndVerifyBody['password'],
  newEmail: ChangeEmailAndVerifyBody['newEmail'],
): Promise<void> => {
  await api.put(
    'api/auth/changeemailverify',
    {
      username,
      password,
      newEmail,
    } satisfies ChangeEmailAndVerifyBody,
    { apiMode: 'guest' },
  );
};

export const forgotPassword = async (identifier: SendChangePassEmailBody['identifier']): Promise<void> => {
  await api.post('api/auth/forgotpassemail', { identifier } satisfies SendChangePassEmailBody, { apiMode: 'guest' });
};

export const checkUserVerify = async (username: CheckUserVerifyQuery['username']): Promise<{ isVerified: boolean }> => {
  const { data } = await api.get<{ isVerified: boolean }>(`api/auth/checkuserverify`, {
    params: {
      username,
    } satisfies CheckUserVerifyQuery,
    apiMode: 'guest',
  });
  return data;
};

export const sendVerificationMail = async (email: SendVerificationMailBody['email']) => {
  await api.post('api/auth/sendverificationemail', { email } satisfies SendVerificationMailBody, { apiMode: 'guest' });
};
