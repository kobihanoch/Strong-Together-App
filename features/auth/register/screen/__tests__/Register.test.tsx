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
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { AuthProviderValue } from '../../../shared/providers/types/auth-context.types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthRootParamList } from '../../../../../navigation/types/authStackTypes';

const mockGoBack = jestObject.fn();
const mockReplace = jestObject.fn();
const mockShowErrorAlert = jestObject.fn<(title: string, description: string) => void>();

let mockAuthState: AuthProviderValue;

jestObject.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    replace: mockReplace,
  }),
}));

jestObject.mock('expo-linear-gradient', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children }: any) => mockReact.createElement(View, null, children),
  };
});

jestObject.mock('react-native-keyboard-aware-scroll-view', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    KeyboardAwareScrollView: ({ children }: any) => mockReact.createElement(View, null, children),
  };
});

jestObject.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => mockReact.createElement(Text, null, name);
});

jestObject.mock('../../providers/AuthProvider', () => ({
  useAuth: () => mockAuthState,
}));

jestObject.mock('../../../../errors/errorAlerts', () => ({
  showErrorAlert: (...args: [string, string]) => mockShowErrorAlert(...args),
}));

import Register from '../Register';

const createAuthState = (overrides: Partial<AuthProviderValue> = {}): AuthProviderValue => ({
  authPhase: 'guest',
  isLoggedIn: false,
  user: null,
  setUser: jestObject.fn(),
  userIdCache: null,
  loading: false,
  userDataLoading: false,
  googleLoading: false,
  appleLoading: false,
  isWorkoutMode: false,
  setIsWorkoutMode: jestObject.fn(),
  isValidatedWithServer: false,
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

const createNavigation = (): StackNavigationProp<AuthRootParamList, 'Register'> =>
  ({
    goBack: mockGoBack,
    replace: mockReplace,
  }) as unknown as StackNavigationProp<AuthRootParamList, 'Register'>;

const fillRequiredFields = (
  helpers: ReturnType<typeof render>,
  overrides: Partial<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = {},
) => {
  const {
    username = 'johnny',
    email = 'john@example.com',
    password = 'Secret123',
    confirmPassword = 'Secret123',
  } = overrides;

  fireEvent.changeText(helpers.getByPlaceholderText('Username'), username);
  fireEvent.changeText(helpers.getByPlaceholderText('Email'), email);
  fireEvent.changeText(helpers.getByPlaceholderText('Password'), password);
  fireEvent.changeText(helpers.getByPlaceholderText('Confirm password'), confirmPassword);
};

jestDescribe('Register screen', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockAuthState = createAuthState();
  });

  jestIt('shows a required-fields error when any mandatory field is empty', async () => {
    const register = jestObject.fn(async () => undefined);
    mockAuthState = createAuthState({ register });
    const { getByText } = render(React.createElement(Register, { navigation: createNavigation() }));

    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      jestExpect(mockShowErrorAlert).toHaveBeenCalledWith('Error', 'Please fill all fields.');
    });
    jestExpect(register).not.toHaveBeenCalled();
    jestExpect(mockReplace).not.toHaveBeenCalled();
  });

  jestIt("shows a mismatch error when the password confirmation doesn't match", async () => {
    const register = jestObject.fn(async () => undefined);
    mockAuthState = createAuthState({ register });
    const view = render(React.createElement(Register, { navigation: createNavigation() }));

    fillRequiredFields(view, { password: 'Secret123', confirmPassword: 'Mismatch123' });
    fireEvent.press(view.getByText('Register'));

    await waitFor(() => {
      jestExpect(mockShowErrorAlert).toHaveBeenCalledWith('Error', "Passwords don't match");
    });
    jestExpect(register).not.toHaveBeenCalled();
    jestExpect(mockReplace).not.toHaveBeenCalled();
  });

  jestIt('submits successfully with explicit gender selection and navigates to Login verification', async () => {
    const register = jestObject.fn(async () => undefined);
    mockAuthState = createAuthState({ register });
    const view = render(React.createElement(Register, { navigation: createNavigation() }));

    fillRequiredFields(view);
    fireEvent.changeText(view.getByPlaceholderText('Full name (Optional)'), 'John Doe');
    fireEvent.press(view.getByText('Gender (Optional)'));
    fireEvent.press(view.getByText('Male'));
    fireEvent.press(view.getByText('Register'));

    await waitFor(() => {
      jestExpect(register).toHaveBeenCalledWith('john@example.com', 'Secret123', 'johnny', 'John Doe', 'Male');
    });
    jestExpect(mockReplace).toHaveBeenCalledWith('Login', {
      needToVerify: true,
      email: 'john@example.com',
      password_: 'Secret123',
      username_: 'johnny',
    });
  });

  jestIt('keeps optional fields empty and falls back to Unknown gender on successful submit', async () => {
    const register = jestObject.fn(async () => undefined);
    mockAuthState = createAuthState({ register });
    const view = render(React.createElement(Register, { navigation: createNavigation() }));

    fillRequiredFields(view);
    fireEvent.press(view.getByText('Register'));

    await waitFor(() => {
      jestExpect(register).toHaveBeenCalledWith('john@example.com', 'Secret123', 'johnny', '', 'Unknown');
    });
    jestExpect(mockReplace).toHaveBeenCalledWith('Login', {
      needToVerify: true,
      email: 'john@example.com',
      password_: 'Secret123',
      username_: 'johnny',
    });
  });
});
