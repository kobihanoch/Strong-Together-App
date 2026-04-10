// services/AuthService.js
import api from '../api/api';
import {
  ChangeEmailAndVerifyBody,
  CheckUserVerifyQuery,
  CreateUserBody,
  LoginRequestBody,
  SendChangePassEmailBody,
  SendVerifcationMailBody,
} from '@strong-together/shared';
import { CreateUserResponse, LoginResponse, RefreshTokenResponse } from '@strong-together/shared';
import { getRefreshToken } from '../utils/tokenStore';

// Rotate tokens
export const refreshAndRotateTokens = async () => {
  const rt = await getRefreshToken();
  if (!rt) throw new Error('No stored refresh token');

  const { data } = await api.post<RefreshTokenResponse>(`/api/auth/refresh`, null, {
    headers: { 'x-refresh-token': `DPoP ${rt}` },
  });
  return data;
};

// Login
export const loginUser = async (
  identifier: LoginRequestBody['identifier'],
  password: LoginRequestBody['password'],
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post<LoginResponse>('/api/auth/login', {
      identifier,
      password,
    } satisfies LoginRequestBody);
    return data;
  } catch (error) {
    throw error;
  }
};

// Log out a user
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
    //return response;
  } catch (error) {
    throw error;
  }
};

// Using edge function to register
export const registerUser = async (
  email: CreateUserBody['email'],
  password: CreateUserBody['password'],
  username: CreateUserBody['username'],
  fullName: CreateUserBody['fullName'],
  gender: CreateUserBody['gender'],
): Promise<void> => {
  try {
    await api.post<CreateUserResponse>('/api/users/create', {
      username,
      fullName,
      email,
      password,
      gender,
    } satisfies CreateUserBody);
  } catch (error) {
    throw error;
  }
};

export const changeEmail = async (
  username: ChangeEmailAndVerifyBody['username'],
  password: ChangeEmailAndVerifyBody['password'],
  newEmail: ChangeEmailAndVerifyBody['newEmail'],
): Promise<void> => {
  await api.put('api/auth/changeemailverify', {
    username,
    password,
    newEmail,
  } satisfies ChangeEmailAndVerifyBody);
};

export const forgotPassword = async (identifier: SendChangePassEmailBody['identifier']): Promise<void> => {
  await api.post('api/auth/forgotpassemail', { identifier } satisfies SendChangePassEmailBody);
};

export const checkUserVerify = async (username: CheckUserVerifyQuery['username']): Promise<{ isVerified: boolean }> => {
  const { data } = await api.get<{ isVerified: boolean }>(`api/auth/checkuserverify`, {
    params: {
      username,
    } satisfies CheckUserVerifyQuery,
  });
  return data;
};

export const sendVerificationMail = async (email: SendVerifcationMailBody['email']) => {
  await api.post('api/auth/sendverificationemail', { email } satisfies SendVerifcationMailBody);
};
