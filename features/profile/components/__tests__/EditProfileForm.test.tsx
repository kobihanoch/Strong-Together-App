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
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { ActivityIndicator, Keyboard, TouchableOpacity } from 'react-native';
import type { UserEntity } from '@strong-together/shared';

const mockUpdateSelfUser = jestObject.fn<(payload: { username?: string; fullName?: string; email?: string }) => Promise<any>>();
const mockShowErrorAlert = jestObject.fn();
const mockShowNotification = jestObject.fn();

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('react-native-gesture-handler', () => {
  const { TextInput } = require('react-native');
  return { TextInput };
});

jestObject.mock('react-native-notifier', () => ({
  Notifier: {
    showNotification: (...args: any[]) => mockShowNotification(...args),
  },
  NotifierComponents: {
    Alert: 'Alert',
  },
}));

jestObject.mock('../../../../errors/errorAlerts', () => ({
  showErrorAlert: (...args: any[]) => mockShowErrorAlert(...args),
}));

jestObject.mock('../../../../services/UserService', () => ({
  updateSelfUser: (...args: [any]) => mockUpdateSelfUser(...args),
}));

jestObject.mock('../../../../components/Column', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(View, props, children);
});

jestObject.mock('../../../../components/Row', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(View, props, children);
});

import EditProfileForm from '../EditProfileForm';

const createUser = (overrides: Partial<Omit<UserEntity, 'password'>> = {}): Omit<UserEntity, 'password'> => ({
  id: 'user-1',
  username: 'johnny',
  email: 'john@example.com',
  name: 'John Doe',
  gender: 'Male',
  created_at: '2026-03-25T10:00:00.000Z',
  profile_image_url: null,
  push_token: null,
  role: 'user',
  is_first_login: false,
  token_version: 1,
  is_verified: true,
  auth_provider: 'email',
  ...overrides,
});

const createProps = (overrides: Partial<React.ComponentProps<typeof EditProfileForm>> = {}) => ({
  initialData: {
    username: 'johnny',
    email: 'john@example.com',
    fullName: 'John Doe',
    gender: 'Male',
    daysOnline: 'Today',
  },
  closeEditSheet: jestObject.fn(),
  openEditSheet: jestObject.fn(),
  setUser: jestObject.fn(),
  ...overrides,
});

jestDescribe('EditProfileForm', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockUpdateSelfUser.mockResolvedValue({
      message: 'updated',
      emailChanged: false,
      user: createUser({ username: 'johnny-2' }),
    });
    jestObject.spyOn(Keyboard, 'dismiss').mockImplementation(() => undefined);
  });

  jestIt('opens the sheet higher when any input receives focus', () => {
    const openEditSheet = jestObject.fn();
    const { getByDisplayValue } = render(
      React.createElement(EditProfileForm, createProps({ openEditSheet })),
    );

    fireEvent(getByDisplayValue('John Doe'), 'focus');
    fireEvent(getByDisplayValue('johnny'), 'focus');
    fireEvent(getByDisplayValue('john@example.com'), 'focus');

    jestExpect(openEditSheet).toHaveBeenNthCalledWith(1, 2);
    jestExpect(openEditSheet).toHaveBeenNthCalledWith(2, 2);
    jestExpect(openEditSheet).toHaveBeenNthCalledWith(3, 2);
  });

  jestIt('resets the inputs and closes the sheet when cancel is pressed', () => {
    const closeEditSheet = jestObject.fn();
    const { getByDisplayValue, getByText } = render(
      React.createElement(EditProfileForm, createProps({ closeEditSheet })),
    );

    fireEvent.changeText(getByDisplayValue('John Doe'), 'Changed Name');
    fireEvent.changeText(getByDisplayValue('johnny'), 'changed-user');
    fireEvent.changeText(getByDisplayValue('john@example.com'), 'changed@example.com');
    fireEvent.press(getByText('Cancel'));

    jestExpect(closeEditSheet).toHaveBeenCalledTimes(1);
    jestExpect(Keyboard.dismiss).toHaveBeenCalled();
  });

  jestIt('shows an error when any field is empty', async () => {
    const { getByDisplayValue, getByText } = render(React.createElement(EditProfileForm, createProps()));

    fireEvent.changeText(getByDisplayValue('John Doe'), '');
    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      jestExpect(mockShowErrorAlert).toHaveBeenCalledWith('Error Updating User', 'Please fill all fields');
    });
    jestExpect(mockUpdateSelfUser).not.toHaveBeenCalled();
  });

  jestIt('closes immediately without updating when nothing changed', async () => {
    const closeEditSheet = jestObject.fn();
    const { getByText } = render(
      React.createElement(EditProfileForm, createProps({ closeEditSheet })),
    );

    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      jestExpect(closeEditSheet).toHaveBeenCalledTimes(1);
    });
    jestExpect(mockUpdateSelfUser).not.toHaveBeenCalled();
  });

  jestIt('updates only the changed fields and shows the regular success notification', async () => {
    const setUser = jestObject.fn();
    const closeEditSheet = jestObject.fn();
    const { getByDisplayValue, getByText } = render(
      React.createElement(EditProfileForm, createProps({ setUser, closeEditSheet })),
    );

    fireEvent.changeText(getByDisplayValue('johnny'), 'johnny-2');
    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      jestExpect(mockUpdateSelfUser).toHaveBeenCalledWith({
        username: 'johnny-2',
        fullName: undefined,
        email: undefined,
      });
    });
    jestExpect(setUser).toHaveBeenCalledWith(createUser({ username: 'johnny-2' }));
    jestExpect(mockShowNotification).toHaveBeenCalledWith(
      jestExpect.objectContaining({
        title: 'User Updated',
      }),
    );
    jestExpect(Keyboard.dismiss).toHaveBeenCalled();
    jestExpect(closeEditSheet).toHaveBeenCalled();
  });

  jestIt('shows the email confirmation notification when the server reports emailChanged', async () => {
    mockUpdateSelfUser.mockResolvedValueOnce({
      message: 'updated',
      emailChanged: true,
      user: createUser({ email: 'new@example.com' }),
    });
    const { getByDisplayValue, getByText } = render(React.createElement(EditProfileForm, createProps()));

    fireEvent.changeText(getByDisplayValue('john@example.com'), 'new@example.com');
    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      jestExpect(mockShowNotification).toHaveBeenCalledWith(
        jestExpect.objectContaining({
          title: 'An email has beent sent to you',
          description: 'Please confirm this new email. Check new@example.com inbox or spam.',
        }),
      );
    });
  });

  jestIt('shows a spinner and disables buttons while the update request is in flight', async () => {
    let resolveUpdate: ((value: any) => void) | undefined;
    mockUpdateSelfUser.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveUpdate = resolve;
        }),
    );
    const { getByDisplayValue, getByText, UNSAFE_getByType, UNSAFE_getAllByType } = render(
      React.createElement(EditProfileForm, createProps()),
    );

    fireEvent.changeText(getByDisplayValue('johnny'), 'johnny-2');
    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      jestExpect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    jestExpect(buttons[0].props.disabled).toBe(true);
    jestExpect(buttons[1].props.disabled).toBe(true);

    await act(async () => {
      resolveUpdate?.({
        message: 'updated',
        emailChanged: false,
        user: createUser({ username: 'johnny-2' }),
      });
    });
  });
});
