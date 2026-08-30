import type { CreateUserBody, GetAuthenticatedUserByIdResponse, LoginRequestBody } from '@strong-together/shared';

export type AppUser = GetAuthenticatedUserByIdResponse;
export type LoginCredentials = LoginRequestBody;
export type RegistrationInput = CreateUserBody;
