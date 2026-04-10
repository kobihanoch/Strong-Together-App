import { CreateUserBody, LoginRequestBody } from '@strong-together/shared';
import { GetAuthenticatedUserByIdResponse } from '@strong-together/shared';

export type AppUser = GetAuthenticatedUserByIdResponse;
export type UserCachePayload = AppUser | null;

export interface AuthContextValue {
  // State
  authPhase: 'checking' | 'authed' | 'guest';
  isLoggedIn: boolean;
  user: AppUser | null;
  setUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  userIdCache: AppUser['id'] | null;
  loading: boolean;
  userDataLoading: boolean;
  googleLoading: boolean;
  appleLoading: boolean;
  isWorkoutMode: boolean;
  setIsWorkoutMode: React.Dispatch<React.SetStateAction<boolean>>;
  isValidatedWithServer: boolean;

  // Actions
  register: (
    email: CreateUserBody['email'],
    password: CreateUserBody['password'],
    username: CreateUserBody['username'],
    fullName: CreateUserBody['fullName'],
    gender: CreateUserBody['gender'],
  ) => Promise<void>;
  login: (identifier: LoginRequestBody['identifier'], password: LoginRequestBody['password']) => Promise<void>;
  handleAppleAuth: () => Promise<void>;
  handleGoogleAuth: () => Promise<void>;
  logout: () => Promise<void>;

  // Initial Functions
  initial: {
    initializeUserSession: (username: AppUser['username']) => Promise<void>;
  };
}
