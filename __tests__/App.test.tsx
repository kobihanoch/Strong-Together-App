/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, waitFor } from '@testing-library/react-native';
import { userWithoutWorkoutProfile } from '../tests/fixtures/userProfiles';

type DpopKeyPair = {
  privateJwk: { kty: string };
  publicJwk: { kty: string };
};

const mockAuthState =
  jest.fn<
    () => {
      authPhase: 'checking' | 'authed' | 'guest';
      isLoggedIn: boolean;
      user: typeof userWithoutWorkoutProfile.user;
    }
  >();
const mockLoadAsync = jest.fn<(...args: any[]) => Promise<void>>();
const mockEnsureDpopKeyPair = jest.fn<() => Promise<DpopKeyPair>>();
const mockGetItem = jest.fn<(...args: any[]) => Promise<string | null>>();
const mockCacheHousekeepingOnBoot = jest.fn<() => Promise<void>>();
const mockUseNavigationContainerRef = jest.fn<() => { current: null }>();

jest.mock('../global', () => ({}), { virtual: true });
jest.mock('@expo/vector-icons/Fonts/MaterialCommunityIcons.ttf', () => 'MaterialCommunityIcons.ttf', {
  virtual: true,
});

jest.mock('expo-font', () => ({
  __esModule: true,
  loadAsync: (...args: any[]) => mockLoadAsync(...args),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: (...args: any[]) =>
      args[0] === 'REACT_QUERY_OFFLINE_CACHE' ? Promise.resolve(null) : mockGetItem(...args),
    setItem: jest.fn<(...args: any[]) => Promise<void>>().mockResolvedValue(undefined),
    removeItem: jest.fn<(...args: any[]) => Promise<void>>().mockResolvedValue(undefined),
  },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '4.5.0',
    },
  },
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
  useNavigationContainerRef: () => mockUseNavigationContainerRef(),
}));

jest.mock('react-native-alert-notification', () => ({
  AlertNotificationRoot: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-notifier', () => ({
  NotifierRoot: () => null,
}));

jest.mock('../infrastructure/api/dpop/ensureDpopKeyPair', () => ({
  __esModule: true,
  default: () => mockEnsureDpopKeyPair(),
}));

jest.mock('../infrastructure/cache/cache.utils', () => ({
  cacheHousekeepingOnBoot: () => mockCacheHousekeepingOnBoot(),
}));

jest.mock('../features/auth/shared/providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockAuthState(),
}));

jest.mock('../features/messages/providers/MessagesProvider', () => ({
  MessagesProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../features/workouts/shared/providers/CardioProvider', () => ({
  CardioProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../features/workouts/shared/providers/WorkoutHistoryProvider', () => ({
  WorkoutHistoryProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../features/workouts/shared/providers/WorkoutPlanProvider', () => ({
  WorkoutPlanProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../navigation/AuthStack', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return {
    __esModule: true,
    default: () => ReactLocal.createElement(TextLocal, null, 'AuthStack'),
  };
});

jest.mock('../navigation/AppStack', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return {
    __esModule: true,
    default: () => ReactLocal.createElement(TextLocal, null, 'AppStack'),
  };
});

jest.mock('../features/settings/push-notifications-setup/notifications-setup.setup', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return {
    __esModule: true,
    default: () => ReactLocal.createElement(TextLocal, null, 'NotificationsSetup'),
  };
});

jest.mock('../shared/components/BottomTabBar', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return {
    __esModule: true,
    default: () => ReactLocal.createElement(TextLocal, null, 'BottomTabBar'),
  };
});

jest.mock('../shared/components/Theme1', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../shared/components/UpdateAppModal', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return {
    __esModule: true,
    default: () => ReactLocal.createElement(TextLocal, null, 'UpdateAppModal'),
  };
});

import App from '../App';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadAsync.mockResolvedValue(undefined);
    mockEnsureDpopKeyPair.mockResolvedValue({
      privateJwk: { kty: 'EC' },
      publicJwk: { kty: 'EC' },
    });
    mockGetItem.mockResolvedValue('4.5.0');
    mockCacheHousekeepingOnBoot.mockResolvedValue(undefined);
    mockUseNavigationContainerRef.mockReturnValue({ current: null });
    mockAuthState.mockReturnValue({
      authPhase: 'guest',
      isLoggedIn: false,
      user: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ensures the DPoP key pair before mounting the app tree', async () => {
    const { queryByText } = render(<App />);

    await waitFor(() => {
      expect(mockEnsureDpopKeyPair).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(queryByText('UpdateAppModal')).toBeTruthy();
    });
  });

  it('renders the auth branch for a guest user profile', async () => {
    mockAuthState.mockReturnValue({
      authPhase: 'guest',
      isLoggedIn: false,
      user: null,
    });

    const { getByText, queryByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('AuthStack')).toBeTruthy();
    });

    expect(queryByText('AppStack')).toBeNull();
    expect(queryByText('BottomTabBar')).toBeNull();
  });

  it('renders the authenticated app branch for a signed-in user profile', async () => {
    mockAuthState.mockReturnValue({
      authPhase: 'authed',
      isLoggedIn: true,
      user: userWithoutWorkoutProfile.user,
    });

    const { getByText, queryByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('AppStack')).toBeTruthy();
    });

    expect(getByText('BottomTabBar')).toBeTruthy();
    expect(getByText('NotificationsSetup')).toBeTruthy();
    expect(queryByText('AuthStack')).toBeNull();
  });

  it('renders neither auth nor app stacks while auth is still checking', async () => {
    mockAuthState.mockReturnValue({
      authPhase: 'checking',
      isLoggedIn: false,
      user: null,
    });

    const { queryByText } = render(<App />);

    await waitFor(() => {
      expect(mockEnsureDpopKeyPair).toHaveBeenCalledTimes(1);
    });

    expect(queryByText('AuthStack')).toBeNull();
    expect(queryByText('AppStack')).toBeNull();
    expect(queryByText('BottomTabBar')).toBeNull();
  });

  it('runs cache housekeeping when the stored cache version differs from the app version', async () => {
    mockGetItem.mockResolvedValue('4.4.0');

    render(<App />);

    await waitFor(() => {
      expect(mockCacheHousekeepingOnBoot).toHaveBeenCalledTimes(1);
    });
  });

  it('skips cache housekeeping when the stored cache version already matches the app version', async () => {
    mockGetItem.mockResolvedValue('4.5.0');

    render(<App />);

    await waitFor(() => {
      expect(mockGetItem).toHaveBeenCalledWith('__VERSION__');
    });

    expect(mockCacheHousekeepingOnBoot).not.toHaveBeenCalled();
  });
});
