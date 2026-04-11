/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

const mockShowNotification = jest.fn();

jest.mock('react-native-draggable-flatlist', () => {
  const ReactLocal = require('react');
  const { FlatList, TouchableOpacity, Text, View } = require('react-native');

  const DraggableFlatList = ({ data, renderItem, onDragEnd }: any) =>
    ReactLocal.createElement(
      View,
      null,
      ReactLocal.createElement(FlatList, {
        data,
        keyExtractor: (item: any) => String(item.id),
        renderItem: ({ item }: any) =>
          renderItem({
            item,
            drag: jest.fn(),
          }),
      }),
      ReactLocal.createElement(
        TouchableOpacity,
        {
          onPress: () =>
            onDragEnd?.({
              data: [...data].reverse(),
            }),
        },
        ReactLocal.createElement(Text, null, 'drag-end'),
      ),
    );

  return {
    __esModule: true,
    default: DraggableFlatList,
    ScaleDecorator: ({ children }: any) => ReactLocal.createElement(View, null, children),
  };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const ReactLocal = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => ReactLocal.createElement(Text, null, name);
});

jest.mock('react-native-notifier', () => ({
  Notifier: {
    showNotification: (...args: any[]) => mockShowNotification(...args),
  },
  NotifierComponents: {
    Alert: 'Alert',
  },
}));

jest.mock('../../../session/components/NumericInputWithRules', () => {
  const ReactLocal = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  return ({ initial, onValidChange }: { initial: number; onValidChange: (value: number) => void }) =>
    ReactLocal.createElement(
      TouchableOpacity,
      { onPress: () => onValidChange(initial + 1) },
      ReactLocal.createElement(Text, null, `numeric-${initial}`),
    );
});

jest.mock('../../../../../../shared/components/Column', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => ReactLocal.createElement(View, props, children);
});

jest.mock('../../../../../../shared/components/Row', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return ({ children, ...props }: any) => ReactLocal.createElement(View, props, children);
});

import SelectedExercisesList from '../SelectedExercisesList';

const createControls = () => ({
  addExercise: jest.fn(),
  addSplit: jest.fn(),
  removeExercise: jest.fn(),
  removeSplit: jest.fn(),
  onDragEnd: jest.fn(),
  updateSets: jest.fn(),
});

const createExercises = () => [
  {
    id: 1,
    name: 'Bench Press',
    targetmuscle: 'Chest',
    specificTargetMuscle: 'Upper Chest',
    order_index: 0,
    sets: [10, 10, 10],
  },
  {
    id: 2,
    name: 'Barbell Row',
    targetmuscle: 'Back',
    specificTargetMuscle: 'Lats',
    order_index: 1,
    sets: [12, 12, 12],
  },
];

describe('SelectedExercisesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders an empty-state message when there are no selected exercises', () => {
    const { getByText } = render(
      <SelectedExercisesList exForSplit={[]} controls={createControls()} selectedSplit="A" />,
    );

    expect(getByText('No selected exercises yet.')).toBeTruthy();
  });

  it('calls removeExercise when pressing the remove control for an exercise', () => {
    const controls = createControls();
    const { getAllByText } = render(
      <SelectedExercisesList exForSplit={createExercises()} controls={controls} selectedSplit="A" />,
    );

    fireEvent.press(getAllByText('close')[0]);

    expect(controls.removeExercise).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'Bench Press',
      }),
    );
  });

  it('calls updateSets with the updated reps array when an input changes', async () => {
    const controls = createControls();
    const { getAllByText } = render(
      <SelectedExercisesList exForSplit={createExercises()} controls={controls} selectedSplit="A" />,
    );

    controls.updateSets.mockClear();
    fireEvent.press(getAllByText('numeric-10')[0]);

    await waitFor(() => {
      expect(controls.updateSets).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, name: 'Bench Press' }),
        [11, 10, 10],
      );
    });
  });

  it('forwards the reordered data through onDragEnd', () => {
    const controls = createControls();
    const exercises = createExercises();
    const { getByText } = render(
      <SelectedExercisesList exForSplit={exercises} controls={controls} selectedSplit="A" />,
    );

    fireEvent.press(getByText('drag-end'));

    expect(controls.onDragEnd).toHaveBeenCalledWith({
      data: [...exercises].reverse(),
    });
  });
});
