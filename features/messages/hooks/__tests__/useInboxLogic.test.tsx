import { act, renderHook } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockUpdateMsgReadStatus = jest.fn<(messageId: string) => Promise<unknown>>();
const mockDeleteMessage = jest.fn<(messageId: string) => Promise<void>>();

jest.mock('../../providers/MessagesProvider', () => ({
  useMessages: () => ({
    allReceivedMessages: [],
    unreadMessages: [],
    updateMessageToRead: mockUpdateMsgReadStatus,
    deleteMessage: mockDeleteMessage,
  }),
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

  it('marks a message as read through the shared message action', async () => {
    const { result } = renderHook(() => useInboxLogic());

    await act(async () => {
      await result.current.markAsRead('message-1');
    });

    expect(mockUpdateMsgReadStatus).toHaveBeenCalledWith('message-1');
  });
});
