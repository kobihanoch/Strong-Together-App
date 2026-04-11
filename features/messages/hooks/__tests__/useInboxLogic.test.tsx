/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AxiosError } from 'axios';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    }),
  },
  AxiosError: class AxiosError extends Error {},
}));

const mockCacheGetJSON = jest.fn<(key: string) => Promise<unknown>>();
const mockCacheSetJSON = jest.fn<(key: string, value: unknown, ttl: number) => Promise<void>>();
const mockCacheDeleteAllCache = jest.fn<() => Promise<void>>();
const mockCacheDeleteAllCacheWithoutStartWorkout = jest.fn<() => Promise<void>>();
const mockGetRefreshToken = jest.fn<() => Promise<string | null>>();
const mockSaveRefreshToken = jest.fn<(token: string) => Promise<void>>();
const mockClearRefreshToken = jest.fn<() => Promise<void>>();
const mockRefreshAndRotateTokens =
  jest.fn<() => Promise<{ accessToken: string; refreshToken: string; userId: string }>>();
const mockFetchSelfUserData = jest.fn<() => Promise<typeof userWithWorkoutAndHistoryProfile.user>>();
const mockGetUserMessages =
  jest.fn<() => Promise<{ messages: typeof userWithWorkoutAndHistoryProfile.notificationMessages }>>();
const mockUpdateMsgReadStatus = jest.fn<(msgId: string) => Promise<string>>();
const mockDeleteMessage = jest.fn<(msgId: string) => Promise<void>>();
const mockRegisterToMessagesListener = jest.fn<(setter: unknown) => () => void>();
const mockListenerCleanup = jest.fn<() => void>();
const mockConnectSocket = jest.fn<(username: string) => Promise<void>>();
const mockDisconnectSocket = jest.fn<() => void>();
const mockUseNetworkStatus = jest.fn<() => boolean>();
const mockHasBootstrapPayload = jest.fn<() => boolean>();
const mockResetBootstrap = jest.fn<() => void>();
const mockSetAccessToken = jest.fn<(token: string | null) => void>();
const mockSetUsernameInHeader = jest.fn<(username: string | null) => void>();
const mockDialogShow = jest.fn<(payload: unknown) => void>();
const mockDialogHide = jest.fn<() => void>();

jest.mock('react-native-alert-notification', () => ({
  ALERT_TYPE: {
    WARNING: 'WARNING',
  },
  Dialog: {
    show: (payload: unknown) => mockDialogShow(payload),
    hide: () => mockDialogHide(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    getAllKeys: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: 'test-version',
    },
  },
}));

jest.mock('../../../../infrastructure/cache/cache.utils', () => {
  const actual = jest.requireActual('../../../../infrastructure/cache/cache.utils') as Record<string, unknown>;
  return {
    ...actual,
    cacheGetJSON: (key: string) => mockCacheGetJSON(key),
    cacheSetJSON: (key: string, value: unknown, ttl: number) => mockCacheSetJSON(key, value, ttl),
    cacheDeleteAllCache: () => mockCacheDeleteAllCache(),
    cacheDeleteAllCacheWithoutStartWorkout: () => mockCacheDeleteAllCacheWithoutStartWorkout(),
  };
});

jest.mock('../../../auth/shared/utils/token-storage.utils', () => ({
  getRefreshToken: () => mockGetRefreshToken(),
  saveRefreshToken: (token: string) => mockSaveRefreshToken(token),
  clearRefreshToken: () => mockClearRefreshToken(),
}));

jest.mock('../../../auth/shared/services/auth.service', () => ({
  refreshAndRotateTokens: () => mockRefreshAndRotateTokens(),
  fetchSelfUserData: () => mockFetchSelfUserData(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock('../../services/messages.service', () => ({
  getUserMessages: () => mockGetUserMessages(),
  updateMsgReadStatus: (msgId: string) => mockUpdateMsgReadStatus(msgId),
  deleteMessage: (msgId: string) => mockDeleteMessage(msgId),
}));

jest.mock('../../../../infrastructure/socket', () => ({
  connectSocket: (username: string) => mockConnectSocket(username),
  disconnectSocket: () => mockDisconnectSocket(),
}));

jest.mock('../../messages.listeners', () => ({
  registerToMessagesListener: (setter: unknown) => mockRegisterToMessagesListener(setter),
}));

jest.mock('../../../../hooks/use-network-status.hook', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../../../auth/shared/hooks/use-google-auth.hook', () => ({
  useGoogleAuth: () => ({
    signInWithGoogle: jest.fn(),
  }),
}));

jest.mock('../../../auth/shared/hooks/use-apple-auth.hook', () => ({
  useAppleAuth: () => ({
    signInWithApple: jest.fn(),
  }),
}));

jest.mock('../../../../infrastructure/api/bootstrap-api', () => ({
  hasBootstrapPayload: () => mockHasBootstrapPayload(),
  resetBootstrap: () => mockResetBootstrap(),
}));

jest.mock('../../../auth/shared/utils/auth.utils', () => ({
  __esModule: true,
  default: {
    setAccessToken: (token: string | null) => mockSetAccessToken(token),
    logout: null,
    setUsernameInHeader: (username: string | null) => mockSetUsernameInHeader(username),
  },
}));

import { MessagesProvider, useMessages } from '../../providers/MessagesProvider';
import useInboxLogic from '../use-inbox-logic.hook';
import {
  userWithoutWorkoutProfile,
  userWithWorkoutAndHistoryProfile,
} from '../../../../tests/fixtures/userProfiles';
import { GlobalAppLoadingProvider } from '../../../../shared/providers/GlobalAppLoadingProvider';
import { AuthProvider, useAuth } from '../../../auth/shared/providers/AuthProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <GlobalAppLoadingProvider>
    <AuthProvider>
      <MessagesProvider>{children}</MessagesProvider>
    </AuthProvider>
  </GlobalAppLoadingProvider>
);

const useIntegratedInboxLogic = () => {
  const auth = useAuth();
  const messages = useMessages();
  const inbox = useInboxLogic();
  return { auth, messages, inbox };
};

const createDeferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const createNetworkAxiosError = (): AxiosError & { isNetworkError: boolean } => {
  const err = new AxiosError('offline') as AxiosError & { isNetworkError: boolean };
  err.isNetworkError = true;
  return err;
};

const setupCacheForScenario = ({
  userId,
  auth,
  notifications,
}: {
  userId: string | null;
  auth?: unknown;
  notifications?: unknown;
}) => {
  mockCacheGetJSON.mockImplementation(async (key: string) => {
    if (key === 'CACHE:USER_ID') return userId;
    if (key.startsWith('CACHE:AUTH:')) return auth ?? null;
    if (key.startsWith('CACHE:INBOX:')) return notifications ?? null;
    return null;
  });
};

describe('useInboxLogic integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNetworkStatus.mockReturnValue(true);
    mockHasBootstrapPayload.mockReturnValue(false);
    mockGetRefreshToken.mockResolvedValue('refresh-token');
    mockSaveRefreshToken.mockResolvedValue(undefined);
    mockClearRefreshToken.mockResolvedValue(undefined);
    mockCacheSetJSON.mockResolvedValue(undefined);
    mockCacheDeleteAllCache.mockResolvedValue(undefined);
    mockCacheDeleteAllCacheWithoutStartWorkout.mockResolvedValue(undefined);
    mockConnectSocket.mockResolvedValue(undefined);
    mockDisconnectSocket.mockReturnValue(undefined);
    mockRegisterToMessagesListener.mockReturnValue(mockListenerCleanup);
    mockUpdateMsgReadStatus.mockImplementation(async (msgId: string) => msgId);
    mockDeleteMessage.mockResolvedValue(undefined);
  });

  it('starts empty while auth is still hydrating and user is still null', async () => {
    setupCacheForScenario({ userId: 'user-1' });
    mockRefreshAndRotateTokens.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'rotated-refresh-token',
      userId: 'user-1',
    });

    const userDeferred = createDeferred<typeof userWithWorkoutAndHistoryProfile.user>();
    const messagesDeferred = createDeferred<{
      messages: typeof userWithWorkoutAndHistoryProfile.notificationMessages;
    }>();

    mockFetchSelfUserData.mockReturnValue(userDeferred.promise);
    mockGetUserMessages.mockReturnValue(messagesDeferred.promise);

    const { result } = renderHook(() => useIntegratedInboxLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user).toBeNull();
    });

    expect(result.current.inbox.allReceivedMessages).toEqual([]);
    expect(result.current.inbox.unreadMessagesCount).toBe(0);
    expect(mockRegisterToMessagesListener).not.toHaveBeenCalled();
  });

  it('hydrates an empty inbox for a signed-in user with no notifications and registers the listener', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithoutWorkoutProfile.user,
      notifications: {
        messages: userWithoutWorkoutProfile.notificationMessages,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result, unmount } = renderHook(() => useIntegratedInboxLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.auth.user?.id).toBe('user-1');
    });

    expect(result.current.inbox.allReceivedMessages).toEqual(userWithoutWorkoutProfile.notificationMessages);
    expect(result.current.inbox.unreadMessagesCount).toBe(0);
    expect(result.current.messages.loadingMessages).toBe(false);
    expect(mockRegisterToMessagesListener).toHaveBeenCalledTimes(1);

    unmount();

    expect(mockListenerCleanup).toHaveBeenCalledTimes(1);
  });

  it('hydrates messages from notifications context and derives the unread count from userProfiles data', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithWorkoutAndHistoryProfile.user,
      notifications: {
        messages: userWithWorkoutAndHistoryProfile.notificationMessages,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedInboxLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.inbox.allReceivedMessages).toEqual(userWithWorkoutAndHistoryProfile.notificationMessages);
    });

    expect(result.current.inbox.unreadMessagesCount).toBe(1);
    expect(result.current.messages.unreadMessages).toEqual([userWithWorkoutAndHistoryProfile.notificationMessages[0]]);
  });

  it('marks a message as read through the service and updates unreadMessages locally', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithWorkoutAndHistoryProfile.user,
      notifications: {
        messages: userWithWorkoutAndHistoryProfile.notificationMessages,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedInboxLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.inbox.unreadMessagesCount).toBe(1);
    });

    await act(async () => {
      await result.current.inbox.markAsRead(userWithWorkoutAndHistoryProfile.notificationMessages[0].id);
    });

    expect(mockUpdateMsgReadStatus).toHaveBeenCalledWith(userWithWorkoutAndHistoryProfile.notificationMessages[0].id);
    expect(result.current.inbox.unreadMessagesCount).toBe(0);
    expect(result.current.inbox.allReceivedMessages[0]).toEqual(
      expect.objectContaining({
        id: 'msg-1',
        is_read: true,
      }),
    );
  });

  it('confirms deletion, calls the delete service, and removes the message from notifications state', async () => {
    setupCacheForScenario({
      userId: 'user-1',
      auth: userWithWorkoutAndHistoryProfile.user,
      notifications: {
        messages: userWithWorkoutAndHistoryProfile.notificationMessages,
      },
    });
    mockRefreshAndRotateTokens.mockRejectedValue(createNetworkAxiosError());

    const { result } = renderHook(() => useIntegratedInboxLogic(), { wrapper });

    await waitFor(() => {
      expect(result.current.inbox.allReceivedMessages).toHaveLength(2);
    });

    act(() => {
      result.current.inbox.confirmAndDeleteMessage(userWithWorkoutAndHistoryProfile.notificationMessages[0].id);
    });

    const dialogConfig = mockDialogShow.mock.calls.at(-1)?.[0] as {
      title: string;
      onPressButton: () => Promise<void>;
    };

    expect(dialogConfig.title).toBe('Delete Message');

    await act(async () => {
      await dialogConfig.onPressButton();
    });

    expect(mockDialogHide).toHaveBeenCalled();
    expect(mockDeleteMessage).toHaveBeenCalledWith(userWithWorkoutAndHistoryProfile.notificationMessages[0].id);
    expect(result.current.inbox.allReceivedMessages).toEqual([
      userWithWorkoutAndHistoryProfile.notificationMessages[1],
    ]);
    expect(result.current.inbox.unreadMessagesCount).toBe(0);
  });
});
