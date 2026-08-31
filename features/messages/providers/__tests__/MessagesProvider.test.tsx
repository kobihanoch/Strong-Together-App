import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockUseMessagesQuery = jest.fn();
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
  useAuth: () => ({ userIdCache: 'user-1', isValidatedWithServer: true }),
}));

jest.mock('../../hooks/use-messages.hook', () => ({
  useMessages: () => mockUseMessagesQuery(),
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
    mockUseMessagesQuery.mockReturnValue({
      data: {
        allReceivedMessages: [
          { id: 'unread', isRead: false },
          { id: 'read', isRead: true },
        ],
        unreadMessages: [{ id: 'unread', isRead: false }],
      },
      loadingStates: { isLoading: false, isFetching: false, isUpdating: false },
      actions: {
        updateMessageToRead: jest.fn(),
        deleteMessage: jest.fn(),
        updateLocalMessages: jest.fn(),
      },
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
