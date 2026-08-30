import { act, renderHook } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { UserMessages } from '../../types/messages.types';

const mockUpdateMsgReadStatus = jest.fn<(messageId: string) => Promise<unknown>>();
const mockSetAllReceivedMessages = jest.fn();

jest.mock('../../providers/MessagesProvider', () => ({
  useMessages: () => ({
    allReceivedMessages: [],
    unreadMessages: [],
    setAllReceivedMessages: mockSetAllReceivedMessages,
  }),
}));

jest.mock('../../services/messages.service', () => ({
  updateMsgReadStatus: (messageId: string) => mockUpdateMsgReadStatus(messageId),
  deleteMessage: jest.fn(),
}));

jest.mock('react-native-alert-notification', () => ({
  ALERT_TYPE: { WARNING: 'WARNING' },
  Dialog: { show: jest.fn(), hide: jest.fn() },
}));

import useInboxLogic from '../use-inbox-logic.hook';

describe('useInboxLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateMsgReadStatus.mockResolvedValue(undefined);
  });

  it('marks a message as read on the server and in shared state', async () => {
    const { result } = renderHook(() => useInboxLogic());

    await act(async () => {
      await result.current.markAsRead('message-1');
    });

    expect(mockUpdateMsgReadStatus).toHaveBeenCalledWith('message-1');
    const updater = mockSetAllReceivedMessages.mock.calls[0][0] as (messages: UserMessages) => UserMessages;
    expect(updater([{ id: 'message-1', isRead: false }] as UserMessages)).toEqual([
      { id: 'message-1', isRead: true },
    ]);
  });
});
