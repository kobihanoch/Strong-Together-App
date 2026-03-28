/* eslint-disable @typescript-eslint/no-unused-vars */
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

import MessageItem from '../MessageItem';
import { AllUserMessages } from '../../../types/dto/messages.dto';
import { MessageEntity } from '../../../types/entities/message.entity';

type MarkAsReadFn = (msgId: MessageEntity['id']) => Promise<void>;
type DeleteMessageFn = (msgId: MessageEntity['id']) => void;

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');

  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('expo-image', () => {
  const { Image } = require('react-native');
  return { Image };
});

jestObject.mock('react-native-gesture-handler', () => {
  const mockReact = require('react');
  const { View } = require('react-native');

  return {
    Swipeable: ({ children, renderRightActions }: any) =>
      mockReact.createElement(
        View,
        null,
        children,
        renderRightActions ? mockReact.createElement(View, null, renderRightActions()) : null,
      ),
  };
});

const createMessage = (overrides: Partial<AllUserMessages> = {}): AllUserMessages => ({
  id: 'msg-1',
  subject: 'Welcome',
  msg: 'This is a long inbox message preview that should be truncated in the list item.',
  sent_at: '2026-03-20T10:00:00.000Z',
  is_read: false,
  sender_full_name: 'John Doe',
  sender_profile_image_url: 'profiles/john.png',
  ...overrides,
});

const createMarkAsReadMock = (): MarkAsReadFn =>
  jestObject.fn(async (_msgId: MessageEntity['id']) => undefined) as unknown as MarkAsReadFn;

const createDeleteMessageMock = (): DeleteMessageFn =>
  jestObject.fn((_msgId: MessageEntity['id']) => undefined) as unknown as DeleteMessageFn;

jestDescribe('MessageItem', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
  });

  jestIt('renders sender, subject, formatted date, and truncated preview for unread messages', () => {
    const { getByText } = render(
      React.createElement(MessageItem, {
        item: createMessage(),
        deleteMessage: createDeleteMessageMock(),
        markAsRead: createMarkAsReadMock(),
      }),
    );

    jestExpect(getByText('John Doe')).toBeTruthy();
    jestExpect(getByText('Welcome')).toBeTruthy();
    jestExpect(getByText('This is a long inbox message p...')).toBeTruthy();
    jestExpect(getAllByTextOnce(getByText, 'Mar 20, 2026')).toBeTruthy();
    jestExpect(getByText('message-text')).toBeTruthy();
  });

  jestIt('opens the modal and marks the message as read when an unread item is pressed', async () => {
    const markAsRead = createMarkAsReadMock();
    const { getByText } = render(
      React.createElement(MessageItem, {
        item: createMessage(),
        deleteMessage: createDeleteMessageMock(),
        markAsRead,
      }),
    );

    fireEvent.press(getByText('Welcome'));

    await waitFor(() => {
      jestExpect(markAsRead).toHaveBeenCalledWith('msg-1');
    });
    jestExpect(getByText('Got it')).toBeTruthy();
    jestExpect(
      getByText('This is a long inbox message preview that should be truncated in the list item.'),
    ).toBeTruthy();
  });

  jestIt('opens the modal without marking as read when the message is already read', async () => {
    const markAsRead = createMarkAsReadMock();
    const { getAllByText, getByText } = render(
      React.createElement(MessageItem, {
        item: createMessage({ is_read: true, msg: 'Short message' }),
        deleteMessage: createDeleteMessageMock(),
        markAsRead,
      }),
    );

    fireEvent.press(getByText('Welcome'));

    await waitFor(() => {
      jestExpect(getAllByText('Short message').length).toBe(2);
    });
    jestExpect(markAsRead).not.toHaveBeenCalled();
    jestExpect(getByText('message-text-outline')).toBeTruthy();
  });

  jestIt('calls deleteMessage with the message id when the swipe delete action is pressed', () => {
    const deleteMessage = createDeleteMessageMock();
    const { getByText } = render(
      React.createElement(MessageItem, {
        item: createMessage(),
        deleteMessage,
        markAsRead: createMarkAsReadMock(),
      }),
    );

    fireEvent.press(getByText('trash-can'));

    jestExpect(deleteMessage).toHaveBeenCalledWith('msg-1');
  });

  jestIt('renders a short message preview without truncation', () => {
    const { getByText, queryByText } = render(
      React.createElement(MessageItem, {
        item: createMessage({ msg: 'Short message' }),
        deleteMessage: createDeleteMessageMock(),
        markAsRead: createMarkAsReadMock(),
      }),
    );

    jestExpect(getByText('Short message')).toBeTruthy();
    jestExpect(queryByText('Short message...')).toBeNull();
  });
});

const getAllByTextOnce = (getByText: (text: string) => unknown, text: string) => getByText(text);
