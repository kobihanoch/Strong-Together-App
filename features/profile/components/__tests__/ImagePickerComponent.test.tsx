/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { render, waitFor } from '@testing-library/react-native';
import type { AuthProviderValue } from '../../../auth/shared/providers/types/auth-context.types';
import type { GetAuthenticatedUserByIdResponse } from '@strong-together/shared';

let mockAuthState: AuthProviderValue;
let mockMediaUploadsState: {
  uploadToStorageAndReturnPath: ReturnType<typeof jestObject.fn>;
  loading: boolean;
  error: Error | null;
};
const mockRequestMediaLibraryPermissionsAsync: any = jestObject.fn();
const mockLaunchImageLibraryAsync: any = jestObject.fn();
const mockApiDelete: any = jestObject.fn();
const mockExpoImage = jestObject.fn((_: any) => null);

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('expo-image', () => ({
  Image: (props: any) => mockExpoImage(props),
}));

jestObject.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: () => mockRequestMediaLibraryPermissionsAsync(),
  launchImageLibraryAsync: () => mockLaunchImageLibraryAsync(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jestObject.mock('../../../../infrastructure/api/api-config/api', () => ({
  __esModule: true,
  default: {
    delete: (...args: any[]) => mockApiDelete(...args),
  },
}));

jestObject.mock('../../../auth/shared/providers/AuthProvider', () => ({
  useAuth: () => mockAuthState,
}));

jestObject.mock('../../hooks/use-media-uploads.hook', () => ({
  __esModule: true,
  default: () => mockMediaUploadsState,
}));

import ImagePickerComponent from '../ImagePickerComponent';

const createUser = (overrides: Partial<GetAuthenticatedUserByIdResponse> = {}): GetAuthenticatedUserByIdResponse => ({
  id: 'user-1',
  username: 'johnny',
  name: 'John Doe',
  email: 'john@example.com',
  gender: 'Male',
  created_at: '2026-03-25T10:00:00.000Z',
  profile_image_url: null,
  push_token: null,
  role: 'user',
  is_first_login: false,
  token_version: 1,
  is_verified: true,
  auth_provider: 'email',
  ...overrides,
});

const createAuthState = (overrides: Partial<AuthProviderValue> = {}): AuthProviderValue => ({
  authPhase: 'authed',
  isLoggedIn: true,
  user: createUser(),
  setUser: jestObject.fn(),
  userIdCache: 'user-1',
  loading: false,
  userDataLoading: false,
  googleLoading: false,
  appleLoading: false,
  isWorkoutMode: false,
  setIsWorkoutMode: jestObject.fn(),
  isValidatedWithServer: true,
  register: jestObject.fn(async () => undefined),
  login: jestObject.fn(async () => undefined),
  handleAppleAuth: jestObject.fn(async () => undefined),
  handleGoogleAuth: jestObject.fn(async () => undefined),
  logout: jestObject.fn(async () => undefined),
  initial: {
    initializeUserSession: jestObject.fn(async () => undefined),
  },
  ...overrides,
});

const createProps = (overrides: Partial<React.ComponentProps<typeof ImagePickerComponent>> = {}) => ({
  openActionSheet: jestObject.fn(),
  closeActionSheet: jestObject.fn(),
  triggerImgPicker: false,
  triggerRemoveImg: false,
  setTriggerImgPicker: jestObject.fn(),
  setTriggerRemoveImg: jestObject.fn(),
  style: { width: 40, height: 40 },
  ...overrides,
});

jestDescribe('ImagePickerComponent', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockAuthState = createAuthState();
    mockMediaUploadsState = {
      uploadToStorageAndReturnPath: jestObject.fn(async () => ({ path: 'avatars/user-1.jpg', url: 'https://cdn/u1' })),
      loading: false,
      error: null,
    };
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockLaunchImageLibraryAsync.mockResolvedValue({ canceled: true, assets: [] });
    mockApiDelete.mockResolvedValue(undefined);
  });

  jestIt('resets the image picker trigger and does not upload when the picker is canceled', async () => {
    const closeActionSheet = jestObject.fn();
    const setTriggerImgPicker = jestObject.fn();
    render(
      React.createElement(
        ImagePickerComponent,
        createProps({
          triggerImgPicker: true,
          closeActionSheet,
          setTriggerImgPicker,
        }),
      ),
    );

    await waitFor(() => {
      jestExpect(mockRequestMediaLibraryPermissionsAsync).toHaveBeenCalledTimes(1);
    });
    jestExpect(mockLaunchImageLibraryAsync).toHaveBeenCalledTimes(1);
    jestExpect(mockMediaUploadsState.uploadToStorageAndReturnPath).not.toHaveBeenCalled();
    jestExpect(closeActionSheet).toHaveBeenCalled();
    jestExpect(setTriggerImgPicker).toHaveBeenCalledWith(false);
  });

  jestIt('uploads the picked image and updates the auth user path', async () => {
    const setUser = jestObject.fn();
    mockAuthState = createAuthState({ setUser });
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file:///picked.jpg' }],
    });

    render(
      React.createElement(
        ImagePickerComponent,
        createProps({
          triggerImgPicker: true,
        }),
      ),
    );

    await waitFor(() => {
      jestExpect(mockMediaUploadsState.uploadToStorageAndReturnPath).toHaveBeenCalledWith({
        uri: 'file:///picked.jpg',
        name: 'user-1.jpg',
        type: 'image/jpeg',
      });
    });

    const updater = setUser.mock.calls[0][0] as (prev: GetAuthenticatedUserByIdResponse | null) => GetAuthenticatedUserByIdResponse;
    jestExpect(updater(createUser()).profile_image_url).toBe('avatars/user-1.jpg');
  });

  jestIt('deletes the current profile image and updates the auth user path to null', async () => {
    const setUser = jestObject.fn();
    mockAuthState = createAuthState({
      user: createUser({ profile_image_url: 'avatars/user-1.jpg' }),
      setUser,
    });
    const setTriggerRemoveImg = jestObject.fn();

    render(
      React.createElement(
        ImagePickerComponent,
        createProps({
          triggerRemoveImg: true,
          setTriggerRemoveImg,
        }),
      ),
    );

    await waitFor(() => {
      jestExpect(mockApiDelete).toHaveBeenCalledWith('/api/users/deleteprofilepic', {
        data: { path: 'avatars/user-1.jpg' },
      });
    });
    const updater = setUser.mock.calls[0][0] as (prev: GetAuthenticatedUserByIdResponse | null) => GetAuthenticatedUserByIdResponse;
    jestExpect(updater(createUser({ profile_image_url: 'avatars/user-1.jpg' })).profile_image_url).toBeNull();
    jestExpect(setTriggerRemoveImg).toHaveBeenCalledWith(false);
  });
});
