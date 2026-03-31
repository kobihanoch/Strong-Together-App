/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  afterEach as jestAfterEach,
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AppState, TouchableOpacity } from 'react-native';
import type { AuthContextValue } from '../../../context/types/authContextTypes.dto';
import type { CheckUserVerifyResponse } from '../../../types/api/auth/responses';
import type { UserEntity } from '../../../types/entities/user.entity';

let mockAuthState: AuthContextValue;
let mockNowMs = 0;

const mockShowErrorAlert = jestObject.fn<(title: string, message: string) => void>();
const mockForgotPassword = jestObject.fn<(identifier: string) => Promise<void>>();
const mockChangeEmail = jestObject.fn<(username: string, password: string, newEmail: string) => Promise<void>>();
const mockCheckUserVerify = jestObject.fn<(username: string) => Promise<CheckUserVerifyResponse>>();
const mockSendVerificationMail = jestObject.fn<(email: string) => Promise<void>>();
const appStateListeners: Array<(status: string) => void> = [];

jestObject.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');

  return ({ name }: { name: string }) => mockReact.createElement(Text, null, name);
});

jestObject.mock('../../InputField', () => {
  const mockReact = require('react');
  const { TextInput } = require('react-native');

  return ({ placeholder, value, onChangeText, ...props }: any) =>
    mockReact.createElement(TextInput, {
      placeholder,
      value,
      onChangeText,
      ...props,
    });
});

jestObject.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}));

jestObject.mock('../../../errors/errorAlerts', () => ({
  showErrorAlert: (...args: [string, string]) => mockShowErrorAlert(...args),
}));

jestObject.mock('../../../services/AuthService', () => ({
  forgotPassword: (...args: [string]) => mockForgotPassword(...args),
  changeEmail: (...args: [string, string, string]) => mockChangeEmail(...args),
  checkUserVerify: (...args: [string]) => mockCheckUserVerify(...args),
  sendVerificationMail: (...args: [string]) => mockSendVerificationMail(...args),
}));

import LoginForm from '../LoginForm';
import VerifyCard from '../VerifyCard';

const createAuthState = (overrides: Partial<AuthContextValue> = {}): AuthContextValue => ({
  authPhase: 'guest',
  isLoggedIn: false,
  user: null,
  setUser: jestObject.fn(),
  userIdCache: null,
  loading: false,
  userDataLoading: false,
  googleLoading: false,
  appleLoading: false,
  isWorkoutMode: false,
  setIsWorkoutMode: jestObject.fn(),
  isValidatedWithServer: false,
  register: jestObject.fn(async () => undefined),
  login: jestObject.fn(async () => undefined),
  handleAppleAuth: jestObject.fn(async () => undefined),
  handleGoogleAuth: jestObject.fn(async () => undefined),
  logout: jestObject.fn(async () => undefined),
  initial: {
    initializeUserSession: jestObject.fn(async () => undefined),
  },
  ...overrides,
});

const createVerifyProps = (
  overrides: Partial<{
    username: UserEntity['username'] | null;
    password: UserEntity['password'] | null;
    initialEmail: UserEntity['email'] | null;
  }> = {},
) => ({
  username: 'johnny',
  password: 'Secret123',
  initialEmail: 'john@example.com',
  ...overrides,
});

/*const advanceClock = (ms: number) => {
  act(() => {
    mockNowMs += ms;
    jestObject.advanceTimersByTime(ms);
  });
};*/

jestDescribe('Login components', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    jestObject.useFakeTimers();
    appStateListeners.length = 0;
    mockNowMs = new Date('2026-03-25T10:00:00.000Z').getTime();

    mockAuthState = createAuthState();
    mockForgotPassword.mockResolvedValue(undefined);
    mockChangeEmail.mockResolvedValue(undefined);
    mockCheckUserVerify.mockResolvedValue({ isVerified: true });
    mockSendVerificationMail.mockResolvedValue(undefined);

    jestObject.spyOn(AppState, 'addEventListener').mockImplementation((_type: any, listener: any) => {
      appStateListeners.push(listener);
      return {
        remove: jestObject.fn(),
      } as any;
    });
    jestObject.spyOn(Date, 'now').mockImplementation(() => mockNowMs);
  });

  jestAfterEach(() => {
    jestObject.useRealTimers();
    jestObject.restoreAllMocks();
  });

  jestDescribe('LoginForm', () => {
    jestIt('renders the login headings and actions', () => {
      const { getByText } = render(React.createElement(LoginForm));

      jestExpect(getByText('Welcome back')).toBeTruthy();
      jestExpect(getByText('Log in now')).toBeTruthy();
      jestExpect(getByText('Forgot your password?')).toBeTruthy();
      jestExpect(getByText('Log in')).toBeTruthy();
    });

    jestIt('blocks login when identifier is empty or whitespace', async () => {
      const login = jestObject.fn(async () => undefined);
      mockAuthState = createAuthState({ login });
      const { getByPlaceholderText, getByText } = render(React.createElement(LoginForm));

      fireEvent.changeText(getByPlaceholderText('Username or Email'), '   ');
      fireEvent.changeText(getByPlaceholderText('Password'), 'Secret123');
      fireEvent.press(getByText('Log in'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith('Error', 'Please fill all fields');
      });
      jestExpect(login).not.toHaveBeenCalled();
    });

    jestIt('blocks login when password is empty', async () => {
      const login = jestObject.fn(async () => undefined);
      mockAuthState = createAuthState({ login });
      const { getByPlaceholderText, getByText } = render(React.createElement(LoginForm));

      fireEvent.changeText(getByPlaceholderText('Username or Email'), 'johnny');
      fireEvent.changeText(getByPlaceholderText('Password'), '');
      fireEvent.press(getByText('Log in'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith('Error', 'Please fill all fields');
      });
      jestExpect(login).not.toHaveBeenCalled();
    });

    jestIt('calls login with the entered values when both fields exist', async () => {
      const login = jestObject.fn(async () => undefined);
      mockAuthState = createAuthState({ login });
      const { getByPlaceholderText, getByText } = render(React.createElement(LoginForm));

      fireEvent.changeText(getByPlaceholderText('Username or Email'), '  john@example.com  ');
      fireEvent.changeText(getByPlaceholderText('Password'), 'Secret123');
      fireEvent.press(getByText('Log in'));

      await waitFor(() => {
        jestExpect(login).toHaveBeenCalledWith('  john@example.com  ', 'Secret123');
      });
    });

    jestIt('shows spinner state and disables login while auth loading is true', () => {
      mockAuthState = createAuthState({ loading: true });
      const { UNSAFE_getAllByType, queryByText } = render(React.createElement(LoginForm));

      const touchables = UNSAFE_getAllByType(TouchableOpacity);

      jestExpect(touchables[1].props.disabled).toBe(true);
      jestExpect(queryByText('Log in')).toBeNull();
    });

    jestIt('rejects forgot password when identifier is missing', async () => {
      const { getByText } = render(React.createElement(LoginForm));

      fireEvent.press(getByText('Forgot your password?'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith(
          'Missing Information',
          'Please enter your email or username first',
        );
      });
      jestExpect(mockForgotPassword).not.toHaveBeenCalled();
    });

    jestIt('starts a cooldown after forgot password succeeds and blocks resend during the cooldown', async () => {
      const { getByPlaceholderText, getByText, UNSAFE_getAllByType } = render(React.createElement(LoginForm));

      fireEvent.changeText(getByPlaceholderText('Username or Email'), 'johnny');
      fireEvent.press(getByText('Forgot your password?'));

      await waitFor(() => {
        jestExpect(mockForgotPassword).toHaveBeenCalledWith('johnny');
      });
      jestExpect(getByText('Resend in 45s')).toBeTruthy();
      jestExpect(UNSAFE_getAllByType(TouchableOpacity)[0].props.disabled).toBe(true);

      fireEvent.press(getByText('Resend in 45s'));
      jestExpect(mockForgotPassword).toHaveBeenCalledTimes(1);
    });

    jestIt('does not create a cooldown when forgot password fails', async () => {
      mockForgotPassword.mockRejectedValueOnce(new Error('network failed'));
      const { getByPlaceholderText, getByText, queryByText } = render(React.createElement(LoginForm));

      fireEvent.changeText(getByPlaceholderText('Username or Email'), 'johnny');
      fireEvent.press(getByText('Forgot your password?'));

      await waitFor(() => {
        jestExpect(mockForgotPassword).toHaveBeenCalledWith('johnny');
      });

      jestExpect(queryByText('Resend in 45s')).toBeNull();
      jestExpect(getByText('Forgot your password?')).toBeTruthy();
    });
  });

  jestDescribe('VerifyCard', () => {
    jestIt('renders the verification card with the provided email', () => {
      const { getByText } = render(React.createElement(VerifyCard, createVerifyProps()));

      jestExpect(getByText('An email has been sent')).toBeTruthy();
      jestExpect(getByText('Please check your inbox:')).toBeTruthy();
      jestExpect(getByText('john@example.com')).toBeTruthy();
    });

    jestIt('syncs the displayed email when the prop changes', () => {
      const { getByText, rerender } = render(React.createElement(VerifyCard, createVerifyProps()));

      rerender(React.createElement(VerifyCard, createVerifyProps({ initialEmail: 'new@example.com' })));

      jestExpect(getByText('new@example.com')).toBeTruthy();
    });

    jestIt('blocks manual login when username or password is missing', async () => {
      const login = jestObject.fn(async () => undefined);
      mockAuthState = createAuthState({ login });
      const { getByText } = render(
        React.createElement(VerifyCard, createVerifyProps({ username: null, password: null })),
      );

      fireEvent.press(getByText('I verified, log in'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith(
          'Missing credentials',
          'Please go back and log in from the main form',
        );
      });
      jestExpect(mockCheckUserVerify).not.toHaveBeenCalled();
      jestExpect(login).not.toHaveBeenCalled();
    });

    jestIt(
      'shows an error and does not login when the verification response says the user is not verified',
      async () => {
        const login = jestObject.fn(async () => undefined);
        mockAuthState = createAuthState({ login });
        mockCheckUserVerify.mockResolvedValueOnce({ isVerified: false });
        const { getByText } = render(React.createElement(VerifyCard, createVerifyProps()));

        fireEvent.press(getByText('I verified, log in'));

        await waitFor(() => {
          jestExpect(mockShowErrorAlert).toHaveBeenCalledWith(
            'Not yet verified',
            'Please verify your email before logging in',
          );
        });
        jestExpect(mockCheckUserVerify).toHaveBeenCalledWith('johnny');
        jestExpect(login).not.toHaveBeenCalled();
      },
    );

    jestIt('logs in when the verification response is verified', async () => {
      const login = jestObject.fn(async () => undefined);
      mockAuthState = createAuthState({ login });
      const { getByText } = render(React.createElement(VerifyCard, createVerifyProps()));

      fireEvent.press(getByText('I verified, log in'));

      await waitFor(() => {
        jestExpect(mockCheckUserVerify).toHaveBeenCalledWith('johnny');
      });
      jestExpect(login).toHaveBeenCalledWith('johnny', 'Secret123');
    });

    jestIt('opens and closes the change email form', () => {
      const { getByText, queryByPlaceholderText } = render(React.createElement(VerifyCard, createVerifyProps()));

      fireEvent.press(getByText('Change email'));
      jestExpect(queryByPlaceholderText('New email')).toBeTruthy();

      fireEvent.press(getByText('Change email'));
      jestExpect(queryByPlaceholderText('New email')).toBeNull();
    });

    jestIt('rejects change email when username is missing', async () => {
      const { getByText, getByPlaceholderText } = render(
        React.createElement(VerifyCard, createVerifyProps({ username: null })),
      );

      fireEvent.press(getByText('Change email'));
      fireEvent.changeText(getByPlaceholderText('Password'), 'Secret123');
      fireEvent.changeText(getByPlaceholderText('New email'), 'new@example.com');
      fireEvent.press(getByText('Save & resend'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith(
          'Missing credentials',
          'Please go back and log in from the main form',
        );
      });
      jestExpect(mockChangeEmail).not.toHaveBeenCalled();
    });

    jestIt('rejects change email when fields are empty', async () => {
      const { getByText } = render(React.createElement(VerifyCard, createVerifyProps()));

      fireEvent.press(getByText('Change email'));
      fireEvent.press(getByText('Save & resend'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith('Error', 'Please fill password and new email');
      });
      jestExpect(mockChangeEmail).not.toHaveBeenCalled();
    });

    jestIt('rejects change email when the email format is invalid', async () => {
      const { getByText, getByPlaceholderText } = render(React.createElement(VerifyCard, createVerifyProps()));

      fireEvent.press(getByText('Change email'));
      fireEvent.changeText(getByPlaceholderText('Password'), 'Secret123');
      fireEvent.changeText(getByPlaceholderText('New email'), 'not-an-email');
      fireEvent.press(getByText('Save & resend'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith('Invalid email', 'Please enter a valid email address');
      });
      jestExpect(mockChangeEmail).not.toHaveBeenCalled();
    });

    jestIt('updates the displayed email and closes the form when change email succeeds', async () => {
      const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(
        React.createElement(VerifyCard, createVerifyProps()),
      );

      fireEvent.press(getByText('Change email'));
      fireEvent.changeText(getByPlaceholderText('Password'), 'Secret123');
      fireEvent.changeText(getByPlaceholderText('New email'), 'new@example.com');
      fireEvent.press(getByText('Save & resend'));

      await waitFor(() => {
        jestExpect(mockChangeEmail).toHaveBeenCalledWith('johnny', 'Secret123', 'new@example.com');
      });
      jestExpect(getByText('new@example.com')).toBeTruthy();
      jestExpect(queryByPlaceholderText('New email')).toBeNull();
    });

    jestIt('locks change email after three successful submissions in the same session', async () => {
      const { getByText, getByPlaceholderText } = render(React.createElement(VerifyCard, createVerifyProps()));

      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (attempt > 0) {
          fireEvent.press(getByText('Change email'));
        } else {
          fireEvent.press(getByText('Change email'));
        }
        fireEvent.changeText(getByPlaceholderText('Password'), 'Secret123');
        fireEvent.changeText(getByPlaceholderText('New email'), `new${attempt}@example.com`);
        fireEvent.press(getByText('Save & resend'));

        await waitFor(() => {
          jestExpect(mockChangeEmail).toHaveBeenCalledTimes(attempt + 1);
        });
      }

      fireEvent.press(getByText('Change email'));
      fireEvent.changeText(getByPlaceholderText('Password'), 'Secret123');
      fireEvent.changeText(getByPlaceholderText('New email'), 'new3@example.com');
      fireEvent.press(getByText('Save & resend'));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith(
          'Too many requests',
          'You requested too many verification emails.',
        );
      });
      jestExpect(mockChangeEmail).toHaveBeenCalledTimes(3);
    });

    jestIt('rejects resend verification when no email exists', async () => {
      const { getByText } = render(React.createElement(VerifyCard, createVerifyProps({ initialEmail: null })));

      fireEvent.press(getByText("I didn't receive an email, Send me again"));

      await waitFor(() => {
        jestExpect(mockShowErrorAlert).toHaveBeenCalledWith(
          'Missing email',
          'No email is available to send verification to',
        );
      });
      jestExpect(mockSendVerificationMail).not.toHaveBeenCalled();
    });

    jestIt('starts a cooldown after resend verification succeeds and blocks resend during the cooldown', async () => {
      const { getByText, UNSAFE_getAllByType } = render(React.createElement(VerifyCard, createVerifyProps()));

      fireEvent.press(getByText("I didn't receive an email, Send me again"));

      await waitFor(() => {
        jestExpect(mockSendVerificationMail).toHaveBeenCalledWith('john@example.com');
      });
      jestExpect(getByText('Resend verification in 45s')).toBeTruthy();
      const touchables = UNSAFE_getAllByType(TouchableOpacity);
      jestExpect(touchables[touchables.length - 1].props.disabled).toBe(true);

      fireEvent.press(getByText('Resend verification in 45s'));
      jestExpect(mockSendVerificationMail).toHaveBeenCalledTimes(1);
    });

    jestIt('does not create a resend cooldown when sending verification fails', async () => {
      mockSendVerificationMail.mockRejectedValueOnce(new Error('network failed'));
      const { getByText, queryByText } = render(React.createElement(VerifyCard, createVerifyProps()));

      fireEvent.press(getByText("I didn't receive an email, Send me again"));

      await waitFor(() => {
        jestExpect(mockSendVerificationMail).toHaveBeenCalledWith('john@example.com');
      });

      jestExpect(queryByText('Resend verification in 45s')).toBeNull();
    });

    jestIt('auto-checks verification on app foreground and logs in only when verified', async () => {
      const login = jestObject.fn(async () => undefined);
      mockAuthState = createAuthState({ login });
      mockCheckUserVerify.mockResolvedValueOnce({ isVerified: false }).mockResolvedValueOnce({ isVerified: true });

      render(React.createElement(VerifyCard, createVerifyProps()));

      await act(async () => {
        await appStateListeners[0]('active');
      });

      jestExpect(mockShowErrorAlert).toHaveBeenCalledWith(
        'Not yet verified',
        'Please verify your email before logging in',
      );
      jestExpect(login).not.toHaveBeenCalled();

      await act(async () => {
        await appStateListeners[0]('active');
      });

      jestExpect(login).toHaveBeenCalledWith('johnny', 'Secret123');
    });

    jestIt('stops the app foreground auto-login checks after three active events', async () => {
      const login = jestObject.fn(async () => undefined);
      mockAuthState = createAuthState({ login });

      render(React.createElement(VerifyCard, createVerifyProps()));

      await act(async () => {
        await appStateListeners[0]('active');
        await appStateListeners[0]('active');
        await appStateListeners[0]('active');
        await appStateListeners[0]('active');
      });

      jestExpect(mockCheckUserVerify).toHaveBeenCalledTimes(3);
      jestExpect(login).toHaveBeenCalledTimes(3);
    });
  });
});
