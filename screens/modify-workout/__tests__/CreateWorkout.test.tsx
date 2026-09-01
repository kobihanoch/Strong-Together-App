/* eslint-disable @typescript-eslint/no-require-imports */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { UseCreateWorkoutLogicReturn } from '../types/use-create-workout.types';

const mockOpen = jest.fn();
const mockLogic = jest.fn();

jest.mock('../CreateWorkout', () => jest.requireActual('../CreateWorkout'));

jest.mock('../../hooks/use-create-workout-logic.hook', () => ({
  __esModule: true,
  default: () => mockLogic(),
}));

jest.mock('../../components/TopSection', () => {
  const ReactLocal = require('react');
  const { Text, TouchableOpacity, View } = require('react-native');
  return function MockTopSection(props: any) {
    return ReactLocal.createElement(
      View,
      null,
      ReactLocal.createElement(Text, null, `top:${props.selectedSplit}:${props.totalExercises}:${props.hasWorkout}`),
      ...(props.splitsList || []).map((split: string) =>
        ReactLocal.createElement(
          TouchableOpacity,
          { key: split, onPress: () => props.setSelectedSplit(split) },
          ReactLocal.createElement(Text, null, `split-${split}`),
        ),
      ),
      ReactLocal.createElement(TouchableOpacity, { onPress: props.addSplit }, ReactLocal.createElement(Text, null, 'top-add')),
      ReactLocal.createElement(
        TouchableOpacity,
        { onPress: () => props.removeSplit(props.selectedSplit) },
        ReactLocal.createElement(Text, null, 'top-remove'),
      ),
      ReactLocal.createElement(TouchableOpacity, { onPress: props.saveWorkout }, ReactLocal.createElement(Text, null, 'top-save')),
    );
  };
});

jest.mock('../../components/SelectedExercisesList', () => {
  const ReactLocal = require('react');
  const { Text, View } = require('react-native');
  return function MockSelectedExercisesList(props: any) {
    return ReactLocal.createElement(
      View,
      null,
      ReactLocal.createElement(Text, null, `selected:${props.selectedSplit}:${props.exForSplit.length}`),
    );
  };
});

jest.mock('../../components/ExercisePickerModal', () => {
  const ReactLocal = require('react');
  const { Text, View } = require('react-native');
  return ReactLocal.forwardRef((props: any, ref: any) => {
    ReactLocal.useImperativeHandle(ref, () => ({
      open: mockOpen,
      close: jest.fn(),
      snapToIndex: jest.fn(),
    }));

    return ReactLocal.createElement(
      View,
      null,
      ReactLocal.createElement(Text, null, `picker:${props.selectedSplit}:${props.muscles.join('|')}:${props.allExercises.length}`),
    );
  });
});

import CreateWorkout from '../CreateWorkout';

const createLogicState = (): UseCreateWorkoutLogicReturn => ({
  selectedExercises: {
    A: [
      {
        id: 1,
        name: 'Bench Press',
        targetMuscle: 'Chest',
        specificTargetMuscle: 'Upper Chest',
        orderIndex: 0,
        sets: [10, 10, 10],
      },
    ],
    B: [],
  },
  splitsList: ['A', 'B'],
  availableExercises: {
    Chest: [{ id: 1, name: 'Bench Press', specificTargetMuscle: 'Upper Chest' }],
  },
  allExercises: [{ id: 1, name: 'Bench Press', specificTargetMuscle: 'Upper Chest', targetMuscle: 'Chest' }],
  muscles: ['All', 'Chest'],
  saveWorkout: async () => {},
  controls: {
    addSplit: jest.fn(),
    removeSplit: jest.fn(),
    addExercise: jest.fn(),
    updateSets: jest.fn(),
    removeExercise: jest.fn(),
    onDragEnd: jest.fn(),
  },
  loadings: {
    isSaving: false,
    exLoading: false,
  },
  hasWorkout: false,
  setSelectedSplit: jest.fn(),
  selectedSplit: 'A',
  exerciseCountMap: { A: 1, B: 0 },
  totalExercises: 1,
  exForSplit: [
    {
      id: 1,
      name: 'Bench Press',
      targetMuscle: 'Chest',
      specificTargetMuscle: 'Upper Chest',
      orderIndex: 0,
      sets: [10, 10, 10],
    },
  ],
});

describe('CreateWorkout screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes the hook state into its child components', () => {
    mockLogic.mockReturnValue(createLogicState());

    const { getByText } = render(React.createElement(CreateWorkout));

    expect(getByText('top:A:1:false')).toBeTruthy();
    expect(getByText('selected:A:1')).toBeTruthy();
    expect(getByText('picker:A:All|Chest:1')).toBeTruthy();
  });

  it('opens the exercise picker modal when the floating add button is pressed', () => {
    mockLogic.mockReturnValue(createLogicState());

    const { getByText } = render(React.createElement(CreateWorkout));

    fireEvent.press(getByText('+'));

    expect(mockOpen).toHaveBeenCalledWith(1);
  });

  it('does not crash during initial loading while exercises are still loading', () => {
    const state = createLogicState();
    state.loadings = {
      isSaving: false,
      exLoading: true,
    };
    state.availableExercises = {} as UseCreateWorkoutLogicReturn['availableExercises'];
    state.allExercises = [];
    state.muscles = ['All'];
    state.exForSplit = [];
    state.totalExercises = 0;
    mockLogic.mockReturnValue(state);

    const { getByText } = render(React.createElement(CreateWorkout));

    expect(getByText('top:A:0:false')).toBeTruthy();
    expect(getByText('selected:A:0')).toBeTruthy();
    expect(getByText('picker:A:All:0')).toBeTruthy();
  });

  it('forwards add and remove split actions from TopSection controls', () => {
    const state = createLogicState();
    mockLogic.mockReturnValue(state);

    const { getByText } = render(React.createElement(CreateWorkout));

    fireEvent.press(getByText('top-add'));
    fireEvent.press(getByText('top-remove'));

    expect(state.controls.addSplit).toHaveBeenCalledTimes(1);
    expect(state.controls.removeSplit).toHaveBeenCalledWith('A');
  });

  it('switches splits and updates the selected exercises UI', () => {
    mockLogic.mockImplementation(() => {
      const [selectedSplit, setSelectedSplit] = React.useState<'A' | 'B'>('A');
      const exercisesBySplit = {
        A: [
          {
            id: 1,
            name: 'Bench Press',
            targetMuscle: 'Chest',
            specificTargetMuscle: 'Upper Chest',
            orderIndex: 0,
            sets: [10, 10, 10],
          },
        ],
        B: [
          {
            id: 2,
            name: 'Barbell Row',
            targetMuscle: 'Back',
            specificTargetMuscle: 'Lats',
            orderIndex: 0,
            sets: [12, 12, 12],
          },
          {
            id: 3,
            name: 'Lat Pulldown',
            targetMuscle: 'Back',
            specificTargetMuscle: 'Lats',
            orderIndex: 1,
            sets: [10, 10, 10],
          },
        ],
      };

      return {
        ...createLogicState(),
        splitsList: ['A', 'B'],
        selectedSplit,
        setSelectedSplit,
        totalExercises: 3,
        exerciseCountMap: { A: 1, B: 2 },
        selectedExercises: exercisesBySplit,
        exForSplit: exercisesBySplit[selectedSplit],
      };
    });

    const { getByText, rerender } = render(React.createElement(CreateWorkout));

    expect(getByText('selected:A:1')).toBeTruthy();

    fireEvent.press(getByText('split-B'));
    rerender(React.createElement(CreateWorkout));

    expect(getByText('top:B:3:false')).toBeTruthy();
    expect(getByText('selected:B:2')).toBeTruthy();
    expect(getByText('picker:B:All|Chest:1')).toBeTruthy();
  });

  it('keeps edit-mode values intact when the hook reports an existing workout', () => {
    const state = createLogicState();
    state.hasWorkout = true;
    state.selectedSplit = 'B';
    state.totalExercises = 4;
    state.selectedExercises = {
      A: [
        {
          id: 1,
          name: 'Bench Press',
          targetMuscle: 'Chest',
          specificTargetMuscle: 'Upper Chest',
          orderIndex: 0,
          sets: [10, 10, 10],
        },
      ],
      B: [],
    };
    state.exForSplit = [];
    state.muscles = ['All', 'Chest', 'Back'];
    state.allExercises = [
      { id: 1, name: 'Bench Press', specificTargetMuscle: 'Upper Chest', targetMuscle: 'Chest' },
      { id: 2, name: 'Row', specificTargetMuscle: 'Lats', targetMuscle: 'Back' },
    ];
    mockLogic.mockReturnValue(state);

    const { getByText } = render(React.createElement(CreateWorkout));

    expect(getByText('top:B:4:true')).toBeTruthy();
    expect(getByText('selected:B:0')).toBeTruthy();
    expect(getByText('picker:B:All|Chest|Back:2')).toBeTruthy();
  });
});
