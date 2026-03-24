/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';

const mockGoBack = jest.fn();
const mockDialogShow = jest.fn();
const mockDialogHide = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const ReactLocal = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => ReactLocal.createElement(Text, null, name);
});

jest.mock('react-native-alert-notification', () => ({
  Dialog: {
    show: (...args: any[]) => mockDialogShow(...args),
    hide: (...args: any[]) => mockDialogHide(...args),
  },
}));

jest.mock('../../Column', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => ReactLocal.createElement(View, props, children);
});

jest.mock('../../Row', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => ReactLocal.createElement(View, props, children);
});

import TopSection from '../TopSection';

const createProps = () => ({
  hasWorkout: false,
  splitsList: ['A', 'B'],
  setSelectedSplit: jest.fn(),
  selectedSplit: 'A',
  exerciseCountMap: { A: 2, B: 1 },
  totalExercises: 3,
  addSplit: jest.fn(),
  removeSplit: jest.fn(),
  saveWorkout: jest.fn(),
});

describe('TopSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls addSplit when pressing the add split control', () => {
    const props = createProps();
    const { getByText } = render(<TopSection {...props} />);

    fireEvent.press(getByText('plus'));

    expect(props.addSplit).toHaveBeenCalledTimes(1);
  });

  it('calls removeSplit with the correct split name', () => {
    const props = createProps();
    const { getAllByText } = render(<TopSection {...props} />);

    fireEvent.press(getAllByText('close')[1]);

    expect(props.removeSplit).toHaveBeenCalledWith('A');
  });

  it('calls setSelectedSplit when selecting another split tab', () => {
    const props = createProps();
    const { getByText } = render(<TopSection {...props} />);

    fireEvent.press(getByText('B'));

    expect(props.setSelectedSplit).toHaveBeenCalledWith('B');
  });

  it('calls saveWorkout when pressing save', () => {
    const props = createProps();
    const { getByText } = render(<TopSection {...props} />);

    fireEvent.press(getByText('Save'));

    expect(props.saveWorkout).toHaveBeenCalledTimes(1);
  });
});
