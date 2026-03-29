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
import { fireEvent, render } from '@testing-library/react-native';

const mockDeleteSelfUser = jestObject.fn(async () => undefined);
const mockLogout = jestObject.fn(async () => undefined);
const mockSetUser = jestObject.fn();
const mockDialogShow = jestObject.fn();
const mockDialogHide = jestObject.fn();
const mockImagePickerComponent = jestObject.fn((_: any) => null);
const mockEditProfileForm = jestObject.fn((_: any) => null);
const modalHandles: Array<{ open: ReturnType<typeof jestObject.fn>; close: ReturnType<typeof jestObject.fn> }> = [];

let mockProfilePageLogic: {
  data: {
    username: string;
    email: string;
    fullName: string;
    gender: string;
    daysOnline: string;
  };
  setUser: typeof mockSetUser;
};
type DialogConfig = {
  title: string;
  type: string;
  onPressButton: () => Promise<void>;
  onHide: () => void;
};

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('react-native-alert-notification', () => ({
  ALERT_TYPE: {
    DANGER: 'danger',
  },
  Dialog: {
    show: (...args: any[]) => mockDialogShow(...args),
    hide: (...args: any[]) => mockDialogHide(...args),
  },
}));

jestObject.mock('../../services/UserService', () => ({
  deleteSelfUser: () => mockDeleteSelfUser(),
}));

jestObject.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jestObject.mock('../../hooks/logic/useProfilePageLogic', () => ({
  __esModule: true,
  default: () => mockProfilePageLogic,
}));

jestObject.mock('../../components/Column', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(View, props, children);
});

jestObject.mock('../../components/Row', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(View, props, children);
});

jestObject.mock('../../components/ProfileComponents/ImagePickerComponent', () => (props: any) =>
  mockImagePickerComponent(props),
);

jestObject.mock('../../components/ProfileComponents/EditProfileForm', () => (props: any) => mockEditProfileForm(props));

jestObject.mock('../../components/SlidingBottomModal', () => {
  const mockReact = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: mockReact.forwardRef(({ children }: any, ref: any) => {
      const handle = {
        open: jestObject.fn(),
        close: jestObject.fn(),
      };
      modalHandles.push(handle);
      mockReact.useImperativeHandle(ref, () => ({
        open: handle.open,
        close: handle.close,
      }));
      return mockReact.createElement(View, null, mockReact.createElement(Text, null, 'Modal'), children);
    }),
  };
});

import Profile from '../Profile';

jestDescribe('Profile screen', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    modalHandles.length = 0;
    mockProfilePageLogic = {
      data: {
        username: 'johnny',
        email: 'john@example.com',
        fullName: 'John Doe',
        gender: 'Male',
        daysOnline: 'Today',
      },
      setUser: mockSetUser,
    };
  });

  jestIt('shows the delete dialog and deletes the account when the confirmation button is pressed', async () => {
    const { getByText } = render(React.createElement(Profile));

    fireEvent.press(getByText('Delete'));

    const dialogConfig = mockDialogShow.mock.calls[0][0] as DialogConfig;
    jestExpect(dialogConfig.title).toBe('Delete Account');
    jestExpect(dialogConfig.type).toBe('danger');

    await dialogConfig.onPressButton();

    jestExpect(mockDialogHide).toHaveBeenCalled();
    jestExpect(mockDeleteSelfUser).toHaveBeenCalledTimes(1);
    jestExpect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
