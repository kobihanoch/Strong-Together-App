import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockUseCacheAndFetch = jest.fn();
const mockRegisterToMessagesListener = jest.fn<() => () => void>();

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('../../../auth/shared/providers/AuthProvider', () => ({
  useAuth: () => ({ user: { id: 'user-1' }, isValidatedWithServer: true }),
}));

jest.mock('../../../../shared/hooks/use-cache-and-fetch.hook', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseCacheAndFetch(...args),
}));

jest.mock('../../messages.listeners', () => ({
  registerToMessagesListener: () => mockRegisterToMessagesListener(),
}));

jest.mock('../../services/messages.service', () => ({
  getUserMessages: jest.fn(),
  updateMsgReadStatus: jest.fn(),
}));

import { MessagesProvider, useMessages } from '../MessagesProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => <MessagesProvider>{children}</MessagesProvider>;

describe('MessagesProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterToMessagesListener.mockReturnValue(jest.fn());
    mockUseCacheAndFetch.mockReturnValue({
      data: [
        { id: 'unread', isRead: false },
        { id: 'read', isRead: true },
      ],
      updateAndCache: jest.fn(),
      loading: false,
    });
  });

  it('shares messages and derives unread messages', () => {
    const { result } = renderHook(() => useMessages(), { wrapper });

    expect(result.current.allReceivedMessages).toHaveLength(2);
    expect(result.current.unreadMessages).toEqual([{ id: 'unread', isRead: false }]);
    expect(result.current.fetchLoading).toBe(false);
    expect(result.current.updateLoading).toBe(false);
  });

  it('registers one message listener', () => {
    renderHook(() => useMessages(), { wrapper });

    expect(mockRegisterToMessagesListener).toHaveBeenCalledTimes(1);
  });
});
