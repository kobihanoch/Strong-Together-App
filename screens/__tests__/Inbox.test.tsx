/* eslint-disable @typescript-eslint/no-require-imports */
import {
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { render } from '@testing-library/react-native';
import React from 'react';

import Inbox from '../Inbox';

const mockUseInboxLogic = jestObject.fn();

jestObject.mock('../../hooks/logic/useInboxLogic', () => ({
  __esModule: true,
  default: () => mockUseInboxLogic(),
}));

jestObject.mock('../../components/InboxComponents/MessageItem', () => {
  const mockReact = require('react');
  const { Text, View } = require('react-native');

  return ({ item }: { item: { subject: string } }) =>
    mockReact.createElement(View, null, mockReact.createElement(Text, null, `message:${item.subject}`));
});

jestObject.mock('react-native-gesture-handler', () => {
  const { FlatList } = require('react-native');

  return { FlatList };
});

const createMessage = (overrides = {}) => ({
  id: 'msg-1',
  subject: 'Welcome',
  msg: 'Welcome to Strong Together',
  sent_at: '2026-03-20T10:00:00.000Z',
  is_read: false,
  sender_full_name: 'John Doe',
  sender_profile_image_url: 'profiles/john.png',
  ...overrides,
});

jestDescribe('Inbox screen', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockUseInboxLogic.mockReturnValue({
      allReceivedMessages: [createMessage(), createMessage({ id: 'msg-2', subject: 'Reminder', is_read: true })],
      confirmAndDeleteMessage: jestObject.fn(),
      markAsRead: jestObject.fn(),
      unreadMessagesCount: 1,
    });
  });

  jestIt('renders the inbox title, unread count, and message list when messages exist', () => {
    const { getByText, queryByText } = render(React.createElement(Inbox));

    jestExpect(getByText('Inbox')).toBeTruthy();
    jestExpect(getByText('1')).toBeTruthy();
    jestExpect(getByText('message:Welcome')).toBeTruthy();
    jestExpect(getByText('message:Reminder')).toBeTruthy();
    jestExpect(queryByText('No messages yet')).toBeNull();
  });

  jestIt('renders the empty state when there are no messages', () => {
    mockUseInboxLogic.mockReturnValue({
      allReceivedMessages: [],
      confirmAndDeleteMessage: jestObject.fn(),
      markAsRead: jestObject.fn(),
      unreadMessagesCount: 0,
    });

    const { getByText, queryByText } = render(React.createElement(Inbox));

    jestExpect(getByText(/You have/)).toBeTruthy();
    jestExpect(getByText('0')).toBeTruthy();
    jestExpect(getByText('No messages yet')).toBeTruthy();
    jestExpect(queryByText('message:Welcome')).toBeNull();
  });

  jestIt('shows zero unread messages even when the list still contains read items', () => {
    mockUseInboxLogic.mockReturnValue({
      allReceivedMessages: [createMessage({ id: 'msg-read', is_read: true, subject: 'Already read' })],
      confirmAndDeleteMessage: jestObject.fn(),
      markAsRead: jestObject.fn(),
      unreadMessagesCount: 0,
    });

    const { getByText } = render(React.createElement(Inbox));

    jestExpect(getByText('0')).toBeTruthy();
    jestExpect(getByText('message:Already read')).toBeTruthy();
  });
});
