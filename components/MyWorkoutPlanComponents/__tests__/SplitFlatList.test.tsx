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
import { FlatList } from 'react-native';
import type { WorkoutContextWorkoutSplit } from '../../../context/types/workoutContextTypes.dto';

let mockMyWorkoutPlanLogic: {
  workoutSplits: WorkoutContextWorkoutSplit[];
  exerciseCounter: Record<string, number> | undefined;
};
let mockAnalysisState: {
  hasTrainedToday: boolean;
  analyzedExerciseTrackingData: { splitDaysByName?: Record<string, number> } | null;
};
const mockStartWorkoutButton = jestObject.fn((_: any) => null);
const mockStartCardioButton = jestObject.fn((_: any) => null);
const mockPageDots = jestObject.fn((_: any) => null);

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text: RNText } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(RNText, null, name),
  };
});

jestObject.mock('expo-image', () => {
  const mockReact = require('react');
  const { View: RNView } = require('react-native');
  return { Image: (props: any) => mockReact.createElement(RNView, props) };
});

jestObject.mock('expo-linear-gradient', () => {
  const mockReact = require('react');
  const { View: RNView } = require('react-native');
  return {
    LinearGradient: ({ children }: any) => mockReact.createElement(RNView, null, children),
  };
});

jestObject.mock('../../../hooks/logic/useMyWorkoutPlanPageLogic', () => ({
  useMyWorkoutPlanPageLogic: () => mockMyWorkoutPlanLogic,
}));

jestObject.mock('../../../context/AnalysisContext', () => ({
  useAnalysisContext: () => mockAnalysisState,
}));

jestObject.mock('../../Badge', () => {
  const mockReact = require('react');
  const { Text: RNText } = require('react-native');
  return ({ label }: { label: string }) => mockReact.createElement(RNText, null, label);
});

jestObject.mock('../../Column', () => {
  const mockReact = require('react');
  const { View: RNView } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(RNView, props, children);
});

jestObject.mock('../../Row', () => {
  const mockReact = require('react');
  const { View: RNView } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(RNView, props, children);
});

jestObject.mock('../../PageDots', () => (props: any) => mockPageDots(props));

jestObject.mock('../StartWorkoutButton', () => (props: any) => mockStartWorkoutButton(props));

jestObject.mock('../StartCardioButton', () => (props: any) => mockStartCardioButton(props));

import SplitFlatList from '../SplitFlatList';

const createSplit = (overrides: Partial<WorkoutContextWorkoutSplit> = {}): WorkoutContextWorkoutSplit => ({
  id: 1,
  name: 'Push',
  muscleGroup: 'Chest, Shoulders (Front), Triceps',
  ...overrides,
});

jestDescribe('SplitFlatList', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockMyWorkoutPlanLogic = {
      workoutSplits: [createSplit(), createSplit({ id: 2, name: 'Legs', muscleGroup: 'Legs' })],
      exerciseCounter: {
        Push: 3,
        Legs: 4,
      },
    };
    mockAnalysisState = {
      hasTrainedToday: false,
      analyzedExerciseTrackingData: {
        splitDaysByName: {
          Push: 5,
          Legs: 2,
        },
      },
    };
  });

  jestIt('renders split details with cleaned muscles and derived stats', () => {
    const { getAllByText, getByText } = render(
      React.createElement(SplitFlatList, {
        setSelectedSplit: jestObject.fn(),
        selectedSplit: mockMyWorkoutPlanLogic.workoutSplits[0],
        openCardioModal: jestObject.fn(),
      }),
    );

    jestExpect(getByText('Push')).toBeTruthy();
    jestExpect(getAllByText('Your preset split for today').length).toBeGreaterThanOrEqual(1);
    jestExpect(getAllByText('Ready').length).toBeGreaterThanOrEqual(1);
    jestExpect(getByText('Chest, Shoulders, Triceps')).toBeTruthy();
    jestExpect(getByText('Upper Body')).toBeTruthy();
    jestExpect(getAllByText('Exercises').length).toBeGreaterThanOrEqual(1);
    jestExpect(getAllByText('Completions').length).toBeGreaterThanOrEqual(1);
    jestExpect(getByText('3')).toBeTruthy();
  });

  jestIt('falls back to zero values when exerciseCounter or split completions are missing', () => {
    mockMyWorkoutPlanLogic = {
      ...mockMyWorkoutPlanLogic,
      exerciseCounter: undefined,
    };
    mockAnalysisState = {
      ...mockAnalysisState,
      analyzedExerciseTrackingData: null,
    };

    const { getAllByText } = render(
      React.createElement(SplitFlatList, {
        setSelectedSplit: jestObject.fn(),
        selectedSplit: mockMyWorkoutPlanLogic.workoutSplits[0],
        openCardioModal: jestObject.fn(),
      }),
    );

    jestExpect(getAllByText('0').length).toBeGreaterThanOrEqual(2);
  });

  jestIt('passes hasTrainedToday and selectedSplit into the CTA components', () => {
    const openCardioModal = jestObject.fn();
    render(
      React.createElement(SplitFlatList, {
        setSelectedSplit: jestObject.fn(),
        selectedSplit: mockMyWorkoutPlanLogic.workoutSplits[1],
        openCardioModal,
      }),
    );

    jestExpect(mockStartWorkoutButton).toHaveBeenCalledWith({
      hasTrainedToday: false,
      selectedSplit: mockMyWorkoutPlanLogic.workoutSplits[1],
    });
    jestExpect(mockStartCardioButton).toHaveBeenCalledWith({
      openCardioModal,
    });
  });

  jestIt('updates selectedSplit and the page indicator when the user scrolls to another page', () => {
    const setSelectedSplit = jestObject.fn();
    const { UNSAFE_getByType } = render(
      React.createElement(SplitFlatList, {
        setSelectedSplit,
        selectedSplit: mockMyWorkoutPlanLogic.workoutSplits[0],
        openCardioModal: jestObject.fn(),
      }),
    );

    const flatList = UNSAFE_getByType(FlatList);

    fireEvent(flatList, 'layout', { nativeEvent: { layout: { width: 320 } } });
    fireEvent.scroll(flatList, {
      nativeEvent: {
        contentOffset: { x: 320, y: 0 },
      },
    });

    jestExpect(setSelectedSplit).toHaveBeenCalledWith(mockMyWorkoutPlanLogic.workoutSplits[1]);
    jestExpect(mockPageDots).toHaveBeenLastCalledWith(
      jestExpect.objectContaining({
        index: 1,
        length: 2,
      }),
    );
  });

  jestIt('ignores scroll updates before the page width is measured', () => {
    const setSelectedSplit = jestObject.fn();
    const { UNSAFE_getByType } = render(
      React.createElement(SplitFlatList, {
        setSelectedSplit,
        selectedSplit: mockMyWorkoutPlanLogic.workoutSplits[0],
        openCardioModal: jestObject.fn(),
      }),
    );

    const flatList = UNSAFE_getByType(FlatList);

    fireEvent.scroll(flatList, {
      nativeEvent: {
        contentOffset: { x: 250, y: 0 },
      },
    });

    jestExpect(setSelectedSplit).not.toHaveBeenCalled();
    jestExpect(mockPageDots).toHaveBeenLastCalledWith(
      jestExpect.objectContaining({
        index: 0,
      }),
    );
  });

  jestIt('handles an empty workoutSplits array without crashing', () => {
    mockMyWorkoutPlanLogic = {
      workoutSplits: [],
      exerciseCounter: {},
    };

    render(
      React.createElement(SplitFlatList, {
        setSelectedSplit: jestObject.fn(),
        selectedSplit: null,
        openCardioModal: jestObject.fn(),
      }),
    );

    jestExpect(mockStartWorkoutButton).toHaveBeenCalledWith({
      hasTrainedToday: false,
      selectedSplit: null,
    });
    jestExpect(mockPageDots).toHaveBeenLastCalledWith(
      jestExpect.objectContaining({
        length: 0,
      }),
    );
  });
});
