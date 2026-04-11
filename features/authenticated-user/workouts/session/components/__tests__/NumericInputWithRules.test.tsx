/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { TextInput } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import NumericInputWithRules from '../NumericInputWithRules';

jestDescribe('NumericInputWithRules', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
  });

  jestIt('commits a rounded numeric value on blur and notifies the parent', () => {
    const onValidChange = jestObject.fn();
    const { UNSAFE_getByType } = render(
      <NumericInputWithRules initial={1.2} precision={1} onValidChange={onValidChange} />,
    );

    const input = UNSAFE_getByType(TextInput);
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '2.34');
    fireEvent(input, 'blur');

    jestExpect(onValidChange).toHaveBeenCalledWith(2.3);
    jestExpect(input.props.value).toBe('2.3');
  });

  jestIt('reverts to the previous committed value when zero is entered and zero is not allowed', () => {
    const onValidChange = jestObject.fn();
    const { UNSAFE_getByType } = render(
      <NumericInputWithRules initial={5} allowZero={false} onValidChange={onValidChange} />,
    );

    const input = UNSAFE_getByType(TextInput);
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '0');
    fireEvent(input, 'blur');

    jestExpect(onValidChange).not.toHaveBeenCalled();
    jestExpect(input.props.value).toBe('5');
  });

  jestIt('accepts zero when allowZero is true', () => {
    const onValidChange = jestObject.fn();
    const { UNSAFE_getByType } = render(
      <NumericInputWithRules initial={5} allowZero={true} onValidChange={onValidChange} />,
    );

    const input = UNSAFE_getByType(TextInput);
    fireEvent(input, 'focus');
    fireEvent.changeText(input, '0');
    fireEvent(input, 'blur');

    jestExpect(onValidChange).toHaveBeenCalledWith(0);
    jestExpect(input.props.value).toBe('0');
  });

  jestIt('strips leading zeros while typing', () => {
    const { UNSAFE_getByType } = render(<NumericInputWithRules initial={0} />);

    const input = UNSAFE_getByType(TextInput);
    fireEvent.changeText(input, '007');

    jestExpect(input.props.value).toBe('7');
  });

  jestIt('stays non-editable and never notifies when the set is locked', () => {
    const onValidChange = jestObject.fn();
    const { UNSAFE_getByType } = render(
      <NumericInputWithRules initial={9} isSetLocked={true} onValidChange={onValidChange} />,
    );

    const input = UNSAFE_getByType(TextInput);
    fireEvent.changeText(input, '12');
    fireEvent(input, 'blur');

    jestExpect(input.props.editable).toBe(false);
    jestExpect(input.props.value).toBe('9');
    jestExpect(onValidChange).not.toHaveBeenCalled();
  });

  jestIt('commits only when the incoming initial value changes under commitOnInitial mode', () => {
    const onValidChange = jestObject.fn();
    const { rerender } = render(
      <NumericInputWithRules initial={7} commitOnInitial={true} onValidChange={onValidChange} />,
    );

    rerender(<NumericInputWithRules initial={8} commitOnInitial={true} onValidChange={onValidChange} />);

    jestExpect(onValidChange).toHaveBeenCalledTimes(1);
    jestExpect(onValidChange).toHaveBeenCalledWith(8);
  });

  jestIt('does not commit the initial value when commitOnInitial is disabled', () => {
    const onValidChange = jestObject.fn();
    render(<NumericInputWithRules initial={7} commitOnInitial={false} onValidChange={onValidChange} />);

    jestExpect(onValidChange).not.toHaveBeenCalled();
  });
});
