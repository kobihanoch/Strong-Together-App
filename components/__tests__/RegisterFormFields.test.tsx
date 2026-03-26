/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useState } from 'react';
import {
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { TextInput } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import type { CreateUserBody } from '../../types/api/auth/requests';

jestObject.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => mockReact.createElement(Text, null, name);
});

import InputField from '../InputField';
import SelectField from '../SelectField';

type RegisterGenderValue = CreateUserBody['gender'] | '';

const SelectFieldHarness = ({
  initialValue = '',
  options,
}: {
  initialValue?: RegisterGenderValue;
  options?: RegisterGenderValue[] | null | undefined;
}) => {
  const [value, setValue] = useState<RegisterGenderValue>(initialValue);
  const resolvedOptions = options === null ? null : (options ?? (['Male', 'Female', 'Other'] as RegisterGenderValue[]));

  return (
    <SelectField<RegisterGenderValue>
      value={value}
      onChange={setValue}
      placeholder="Gender (Optional)"
      {...(resolvedOptions ? { options: resolvedOptions } : {})}
    />
  );
};

jestDescribe('Register form field components', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
  });

  jestDescribe('InputField', () => {
    jestIt('renders the current value, placeholder, and icon, then forwards text updates', () => {
      const onChangeText = jestObject.fn();
      const { getByPlaceholderText, getByText } = render(
        <InputField placeholder="Username" value="johnny" onChangeText={onChangeText} iconName="account" />,
      );

      fireEvent.changeText(getByPlaceholderText('Username'), 'johnny-updated');

      jestExpect(getByText('account')).toBeTruthy();
      jestExpect(onChangeText).toHaveBeenCalledWith('johnny-updated');
    });

    jestIt('forwards secure and autocomplete-related props to the native input', () => {
      const { UNSAFE_getByType } = render(
        <InputField
          placeholder="Password"
          value="Secret123"
          onChangeText={jestObject.fn()}
          iconName="lock"
          secureTextEntry={true}
          textContentType="password"
          autoComplete="password"
        />,
      );

      const input = UNSAFE_getByType(TextInput);

      jestExpect(input.props.secureTextEntry).toBe(true);
      jestExpect(input.props.textContentType).toBe('password');
      jestExpect(input.props.autoComplete).toBe('password');
      jestExpect(input.props.placeholderTextColor).toBe('#e0efff');
    });
  });

  jestDescribe('SelectField', () => {
    jestIt('shows the placeholder when the current value is empty', () => {
      const { getByText, queryByText } = render(<SelectFieldHarness />);

      jestExpect(getByText('Gender (Optional)')).toBeTruthy();
      jestExpect(queryByText('Male')).toBeNull();
    });

    jestIt('opens the dropdown, selects an option, closes it, and shows the selected value', () => {
      const { getByText, queryByText } = render(<SelectFieldHarness />);

      fireEvent.press(getByText('Gender (Optional)'));
      jestExpect(getByText('Male')).toBeTruthy();
      jestExpect(getByText('Female')).toBeTruthy();

      fireEvent.press(getByText('Female'));

      jestExpect(getByText('Female')).toBeTruthy();
      jestExpect(queryByText('Male')).toBeNull();
      jestExpect(queryByText('Other')).toBeNull();
    });

    jestIt('shows the current selected value instead of the placeholder on first render', () => {
      const { getAllByText, queryByText } = render(<SelectFieldHarness initialValue="Other" />);

      jestExpect(getAllByText('Other').length).toBe(1);
      jestExpect(queryByText('Gender (Optional)')).toBeNull();
    });

    jestIt('marks the selected option with a check icon when reopening the dropdown', () => {
      const { getByText, getAllByText } = render(<SelectFieldHarness initialValue="Male" />);

      fireEvent.press(getByText('Male'));

      jestExpect(getAllByText('Male').length).toBeGreaterThanOrEqual(2);
      jestExpect(getByText('check')).toBeTruthy();
    });

    jestIt('closes the dropdown when pressing outside on the overlay', () => {
      const { getByText, queryByText, UNSAFE_getAllByType } = render(<SelectFieldHarness />);

      fireEvent.press(getByText('Gender (Optional)'));
      fireEvent.press(UNSAFE_getAllByType(require('react-native').TouchableWithoutFeedback)[0]);

      jestExpect(queryByText('Male')).toBeNull();
      jestExpect(queryByText('Female')).toBeNull();
    });

    jestIt('renders safely when options are undefined and does not show menu rows after opening', () => {
      const { getByText, queryByText } = render(<SelectFieldHarness options={null} />);

      fireEvent.press(getByText('Gender (Optional)'));

      jestExpect(queryByText('Male')).toBeNull();
      jestExpect(queryByText('Female')).toBeNull();
      jestExpect(queryByText('Other')).toBeNull();
    });
  });
});
