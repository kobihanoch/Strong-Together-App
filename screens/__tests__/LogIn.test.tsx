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
import { fireEvent, render } from '@testing-library/react-native';
import type { RouteProp } from '@react-navigation/native';
import type { AuthRootParamList } from '../../navigation/types/authStackTypes';
import type { StackNavigationProp } from '@react-navigation/stack';

const mockGoBack = jestObject.fn();
const mockLoginForm = jestObject.fn(() => null);
const mockVerifyCard = jestObject.fn((_: any) => null);

jestObject.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jestObject.mock('expo-linear-gradient', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children }: any) => mockReact.createElement(View, null, children),
  };
});

jestObject.mock('react-native-keyboard-aware-scroll-view', () => {
  const mockReact = require('react');
  const { View } = require('react-native');
  return {
    KeyboardAwareScrollView: ({ children }: any) => mockReact.createElement(View, null, children),
  };
});

jestObject.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => mockReact.createElement(Text, null, name);
});

jestObject.mock('../../components/LoginComponents/LoginForm', () => () => mockLoginForm());

jestObject.mock('../../components/LoginComponents/VerifyCard', () => (props: any) => mockVerifyCard(props));

import Login from '../LogIn';

const createRoute = (params?: Partial<AuthRootParamList['Login']>): RouteProp<AuthRootParamList, 'Login'> =>
  ({
    key: 'Login-key',
    name: 'Login',
    params: params as AuthRootParamList['Login'],
  }) as RouteProp<AuthRootParamList, 'Login'>;

const createNavigation = (): StackNavigationProp<AuthRootParamList, 'Login'> =>
  ({
    goBack: mockGoBack,
  }) as unknown as StackNavigationProp<AuthRootParamList, 'Login'>;

jestDescribe('LogIn screen', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
  });

  jestIt('renders LoginForm when route params are missing', () => {
    render(React.createElement(Login, { route: createRoute(undefined), navigation: createNavigation() }));

    jestExpect(mockLoginForm).toHaveBeenCalledTimes(1);
    jestExpect(mockVerifyCard).not.toHaveBeenCalled();
  });

  jestIt('renders LoginForm when needToVerify is false', () => {
    render(
      React.createElement(Login, {
        route: createRoute({
          needToVerify: false,
          email: 'john@example.com',
          password_: 'Secret123',
          username_: 'johnny',
        }),
        navigation: createNavigation(),
      }),
    );

    jestExpect(mockLoginForm).toHaveBeenCalledTimes(1);
    jestExpect(mockVerifyCard).not.toHaveBeenCalled();
  });

  jestIt('renders VerifyCard with the route params when needToVerify is true', () => {
    render(
      React.createElement(Login, {
        route: createRoute({
          needToVerify: true,
          email: 'john@example.com',
          password_: 'Secret123',
          username_: 'johnny',
        }),
        navigation: createNavigation(),
      }),
    );

    jestExpect(mockLoginForm).not.toHaveBeenCalled();
    jestExpect(mockVerifyCard).toHaveBeenCalledWith({
      initialEmail: 'john@example.com',
      password: 'Secret123',
      username: 'johnny',
    });
  });

  jestIt('navigates back when the intro button is pressed', () => {
    const { getByText } = render(
      React.createElement(Login, {
        route: createRoute({
          needToVerify: false,
          email: null,
          password_: null,
          username_: null,
        }),
        navigation: createNavigation(),
      }),
    );

    fireEvent.press(getByText('Intro'));

    jestExpect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
