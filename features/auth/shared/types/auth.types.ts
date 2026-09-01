import type { CreateUserBody, GetCurrentUserResponse, LoginRequestBody } from '@strong-together/shared';

export type AppUser = GetCurrentUserResponse;
export type LoginCredentials = LoginRequestBody;
export type RegistrationInput = CreateUserBody;
