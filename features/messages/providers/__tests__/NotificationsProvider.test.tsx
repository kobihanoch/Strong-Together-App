/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  guestProfile,
  userWithWorkoutAndHistoryProfile,
  userWithoutWorkoutProfile,
} from '../../../../tests/fixtures/userProfiles';
import type { GetAllUserMessagesResponse } from '@strong-together/shared';
import type { MessageAfterSendResponse } from '@strong-together/shared';

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

type UseCacheAndFetchReturn = { loading: boolean; cacheKnown: boolean };
type UseCacheAndFetchMockFn = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: (data: any) => void,
  cachedPayload: unknown,
  logLabel: string,
) => UseCacheAndFetchReturn;

const mockAuthState = jest.fn<
  () => {
    user: typeof userWithoutWorkoutProfile.user;
    isValidatedWithServer: boolean;
  }
>();
const mockUseCacheAndFetch = jest.fn<UseCacheAndFetchMockFn>();
const mockUseUpdateGlobalLoading = jest.fn<(key: string, value: boolean) => void>();
const mockGetUserMessages = jest.fn<() => Promise<GetAllUserMessagesResponse>>();
const mockRegisterToMessagesListener = jest.fn();
const mockListenerCleanup = jest.fn();

const useCacheAndFetchMock = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: (data: any) => void,
  cachedPayload: unknown,
  logLabel: string,
) => mockUseCacheAndFetch(user, keyBuilderFn, isValidatedByServerFlag, fetchFn, onDataFn, cachedPayload, logLabel);

const useUpdateGlobalLoadingMock = (key: string, value: boolean) => mockUseUpdateGlobalLoading(key, value);
const getUserMessagesMock = () => mockGetUserMessages();

jest.mock('../../../auth/shared/providers/AuthProvider', () => ({
  useAuth: () => mockAuthState(),
}));

jest.mock('../../../../shared/hooks/use-cache-and-fetch.hook', () => ({
  __esModule: true,
  default: useCacheAndFetchMock,
}));

jest.mock('../../../../shared/hooks/use-update-global-loading.hook', () => ({
  __esModule: true,
  default: useUpdateGlobalLoadingMock,
}));

jest.mock('../../services/messages.service', () => ({
  getUserMessages: getUserMessagesMock,
}));

jest.mock('../../messages.listeners', () => ({
  registerToMessagesListener: (...args: any[]) => mockRegisterToMessagesListener(...args),
}));

import { MessagesProvider, useMessages } from '../MessagesProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MessagesProvider>{children}</MessagesProvider>
);

const createHydratingUseCacheAndFetchMock = (payload: GetAllUserMessagesResponse | any) => {
  let hydrated = false;
  return (
    user: unknown,
    keyBuilderFn: unknown,
    isValidated: boolean,
    fetchFn: unknown,
    onDataFn: (data: any) => void,
    cachedPayload: unknown,
    label: string,
  ) => {
    if (!hydrated) {
      hydrated = true;
      onDataFn(payload);
    }
    return {
      loading: false,
      cacheKnown: true,
    };
  };
};

const createSocketMessage = (overrides: Partial<MessageAfterSendResponse> = {}): MessageAfterSendResponse => ({
  id: 'msg-3',
  sender_id: 'coach-1',
  receiver_id: 'user-1',
  subject: 'New plan',
  msg: 'Your updated workout is ready.',
  sent_at: '2026-03-28T09:00:00.000Z',
  is_read: false,
  sender_username: 'coachmike',
  sender_full_name: 'Coach Mike',
  sender_profile_image_url: 'profiles/coach-mike.png',
  sender_gender: 'Male',
  ...overrides,
});

describe('NotificationsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState.mockReturnValue({
      user: guestProfile.user,
      isValidatedWithServer: false,
    });
    mockUseCacheAndFetch.mockReturnValue({
      loading: false,
      cacheKnown: true,
    });
    mockGetUserMessages.mockResolvedValue({
      messages: [],
    });
    mockRegisterToMessagesListener.mockReturnValue(mockListenerCleanup);
  });

  it('keeps all notifications state empty for the guest profile and skips socket registration', () => {
    const { result } = renderHook(() => useMessages(), { wrapper });

    expect(result.current.allReceivedMessages).toEqual(guestProfile.notificationMessages);
    expect(result.current.unreadMessages).toEqual([]);
    expect(result.current.loadingMessages).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      guestProfile.user,
      expect.any(Function),
      false,
      expect.any(Function),
      expect.any(Function),
      {
        messages: [],
      },
      'Messages Context',
    );
    expect(mockRegisterToMessagesListener).not.toHaveBeenCalled();
  });

  it('hydrates an empty inbox for a signed-in user with no notifications and registers the listener', async () => {
    mockAuthState.mockReturnValue({
      user: userWithoutWorkoutProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        messages: userWithoutWorkoutProfile.notificationMessages,
      }),
    );

    const { result, unmount } = renderHook(() => useMessages(), { wrapper });

    await waitFor(() => {
      expect(result.current.allReceivedMessages).toEqual([]);
    });

    expect(result.current.unreadMessages).toEqual([]);
    expect(mockRegisterToMessagesListener).toHaveBeenCalledTimes(1);
    expect(mockRegisterToMessagesListener).toHaveBeenCalledWith(expect.any(Function));

    unmount();

    expect(mockListenerCleanup).toHaveBeenCalledTimes(1);
  });

  it('hydrates messages and derives unreadMessages for a user with notifications', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutAndHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        messages: userWithWorkoutAndHistoryProfile.notificationMessages,
      }),
    );

    const { result } = renderHook(() => useMessages(), { wrapper });

    await waitFor(() => {
      expect(result.current.allReceivedMessages).toEqual(userWithWorkoutAndHistoryProfile.notificationMessages);
    });

    expect(result.current.unreadMessages).toEqual([userWithWorkoutAndHistoryProfile.notificationMessages[0]]);
    expect(result.current.unreadMessages).toHaveLength(1);
  });

  it('appends a new unread socket message through the exposed setter and updates unreadMessages', async () => {
    mockAuthState.mockReturnValue({
      user: userWithoutWorkoutProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        messages: userWithoutWorkoutProfile.notificationMessages,
      }),
    );

    const { result } = renderHook(() => useMessages(), { wrapper });

    await waitFor(() => {
      expect(result.current.allReceivedMessages).toEqual([]);
    });

    await act(async () => {
      result.current.setAllReceivedMessages((prev: typeof result.current.allReceivedMessages) => [createSocketMessage(), ...prev]);
    });

    expect(result.current.allReceivedMessages[0]).toEqual(
      expect.objectContaining({
        id: 'msg-3',
        is_read: false,
        subject: 'New plan',
      }),
    );
    expect(result.current.unreadMessages).toHaveLength(1);
    expect(result.current.unreadMessages[0].id).toBe('msg-3');
  });

  it('keeps unreadMessages stable when an added socket message is already marked as read', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutAndHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        messages: userWithWorkoutAndHistoryProfile.notificationMessages,
      }),
    );

    const { result } = renderHook(() => useMessages(), { wrapper });

    await waitFor(() => {
      expect(result.current.unreadMessages).toHaveLength(1);
    });

    await act(async () => {
      result.current.setAllReceivedMessages((prev: typeof result.current.allReceivedMessages) => [
        createSocketMessage({ id: 'msg-4', is_read: true, subject: 'Read update' }),
        ...prev,
      ]);
    });

    expect(result.current.allReceivedMessages).toHaveLength(3);
    expect(result.current.unreadMessages).toHaveLength(1);
    expect(result.current.unreadMessages[0].id).toBe('msg-1');
  });
});
