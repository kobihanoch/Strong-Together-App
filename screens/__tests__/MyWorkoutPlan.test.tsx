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
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Keyboard, TouchableOpacity } from 'react-native';
import type { ExerciseInPlan } from '../../types/dto/workoutPlans.dto';
import type { AerobicsDailyRecord } from '../../types/dto/aerobics.dto';

const mockNavigate = jestObject.fn();
const mockReplace = jestObject.fn();
const mockLogUserCardio = jestObject.fn<(mins: number, secs: number, type: string) => Promise<any>>();
const mockShowNotification = jestObject.fn();
const mockModalOpen = jestObject.fn();
const mockModalClose = jestObject.fn();
let mockWorkoutPlanLogic: {
  hasWorkout: boolean;
  filteredExercises: ExerciseInPlan[] | undefined;
  setSelectedSplit: ReturnType<typeof jestObject.fn>;
  selectedSplit: { id: number; name: string; muscleGroup: string | null } | null;
};
let mockCardioContext: {
  cardioForToday: AerobicsDailyRecord | null;
  setDailyCardioMap: ReturnType<typeof jestObject.fn>;
  setWeeklyCardioMap: ReturnType<typeof jestObject.fn>;
};

jestObject.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
  }),
}));

jestObject.mock('react-native-notifier', () => ({
  Notifier: {
    showNotification: (...args: any[]) => mockShowNotification(...args),
  },
  NotifierComponents: {
    Alert: 'Alert',
  },
}));

jestObject.mock('../../services/CardioService', () => ({
  logUserCardio: (...args: [number, number, string]) => mockLogUserCardio(...args),
}));

jestObject.mock('../../hooks/useLightStatusBar', () => ({
  __esModule: true,
  default: jestObject.fn(),
}));

jestObject.mock('../../hooks/logic/useMyWorkoutPlanPageLogic', () => ({
  useMyWorkoutPlanPageLogic: () => mockWorkoutPlanLogic,
}));

jestObject.mock('../../context/CardioContext', () => ({
  useCardioContext: () => mockCardioContext,
}));

jestObject.mock('../../components/Column', () => {
  const mockReact = require('react');
  const { View: RNView } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(RNView, props, children);
});

jestObject.mock('../../components/Row', () => {
  const mockReact = require('react');
  const { View: RNView } = require('react-native');
  return ({ children, ...props }: any) => mockReact.createElement(RNView, props, children);
});

jestObject.mock('../../components/MyWorkoutPlanComponents/SplitFlatList', () => {
  const mockReact = require('react');
  const { Text: RNText, TouchableOpacity: RNTouchableOpacity, View: RNView } = require('react-native');
  return ({ openCardioModal }: { openCardioModal: (i?: number) => void }) =>
    mockReact.createElement(
      RNView,
      null,
      mockReact.createElement(RNText, null, 'Split list'),
      mockReact.createElement(
        RNTouchableOpacity,
        { onPress: () => openCardioModal(1) },
        mockReact.createElement(RNText, null, 'Open cardio modal'),
      ),
    );
});

jestObject.mock('../../components/MyWorkoutPlanComponents/RenderItemExercise', () => {
  const mockReact = require('react');
  const { Text: RNText } = require('react-native');
  return ({ item }: { item: ExerciseInPlan }) => mockReact.createElement(RNText, null, item.exercise);
});

jestObject.mock('../../components/MyWorkoutPlanComponents/NoWorkoutPlan', () => {
  const mockReact = require('react');
  const { Text: RNText, TouchableOpacity: RNTouchableOpacity } = require('react-native');
  return ({ onCreatePress }: { onCreatePress: () => void }) =>
    mockReact.createElement(
      RNTouchableOpacity,
      { onPress: onCreatePress },
      mockReact.createElement(RNText, null, 'Create workout'),
    );
});

jestObject.mock('../../components/SlidingBottomModal', () => {
  const mockReact = require('react');
  const { Text: RNText, View: RNView } = require('react-native');
  return {
    __esModule: true,
    default: mockReact.forwardRef(({ title, children, data, renderItem }: any, ref: any) => {
      mockReact.useImperativeHandle(ref, () => ({
        open: mockModalOpen,
        close: mockModalClose,
        snapToIndex: jestObject.fn(),
      }));

      return mockReact.createElement(
        RNView,
        null,
        title ? mockReact.createElement(RNText, null, title) : null,
        Array.isArray(data) && renderItem
          ? data.map((item, index) =>
              mockReact.createElement(RNView, { key: `${title}-${index}` }, renderItem({ item })),
            )
          : null,
        children,
      );
    }),
  };
});

import MyWorkoutPlan from '../MyWorkoutPlan';

const createExercise = (overrides: Partial<ExerciseInPlan> = {}): ExerciseInPlan => ({
  id: 11,
  sets: [8, 10, 12],
  is_active: true,
  targetmuscle: 'Chest',
  specifictargetmuscle: 'Upper Chest',
  exercise: 'Incline Bench Press',
  workoutsplit: 'Push',
  ...overrides,
});

const createCardioRecord = (overrides: Partial<AerobicsDailyRecord> = {}): AerobicsDailyRecord => ({
  type: 'Walk',
  duration_mins: 12,
  duration_sec: 30,
  ...overrides,
});

jestDescribe('MyWorkoutPlan screen', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockWorkoutPlanLogic = {
      hasWorkout: true,
      filteredExercises: [createExercise()],
      setSelectedSplit: jestObject.fn(),
      selectedSplit: {
        id: 1,
        name: 'Push',
        muscleGroup: 'Chest, Shoulders, Triceps',
      },
    };
    mockCardioContext = {
      cardioForToday: null,
      setDailyCardioMap: jestObject.fn(),
      setWeeklyCardioMap: jestObject.fn(),
    };
    mockLogUserCardio.mockResolvedValue({
      daily: {
        '2026-03-25': [createCardioRecord()],
      },
      weekly: {
        '2026-W13': {
          records: [],
          total_duration_mins: 12,
          total_duration_sec: 30,
        },
      },
    });
    jestObject.spyOn(Keyboard, 'dismiss').mockImplementation(() => undefined);
  });

  jestIt('renders the no-workout branch and navigates to CreateWorkout', () => {
    mockWorkoutPlanLogic = {
      ...mockWorkoutPlanLogic,
      hasWorkout: false,
    };

    const { getByText } = render(React.createElement(MyWorkoutPlan));

    fireEvent.press(getByText('Create workout'));

    jestExpect(mockNavigate).toHaveBeenCalledWith('CreateWorkout');
  });

  jestIt('renders the cardio summary when cardioForToday exists', () => {
    mockCardioContext = {
      ...mockCardioContext,
      cardioForToday: createCardioRecord({ type: 'Run', duration_mins: 61, duration_sec: 5 }),
    };

    const { getByText } = render(React.createElement(MyWorkoutPlan));

    jestExpect(getByText('Cardio')).toBeTruthy();
    jestExpect(getByText('Ran')).toBeTruthy();
    jestExpect(getByText('1 hr 1 min')).toBeTruthy();
  });

  jestIt('renders the cardio form and keeps save disabled when both values are zero', () => {
    const { getByText, UNSAFE_getAllByType } = render(React.createElement(MyWorkoutPlan));

    jestExpect(getByText('Walk')).toBeTruthy();
    jestExpect(getByText('Run')).toBeTruthy();
    jestExpect(getByText('Save')).toBeTruthy();
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const saveButton = touchables[touchables.length - 1];
    jestExpect(saveButton.props.disabled).toBe(true);

    fireEvent.press(getByText('Save'));

    jestExpect(mockLogUserCardio).not.toHaveBeenCalled();
  });

  jestIt('filters non-digit input, clamps seconds on blur, and opens the modal to the input snap point on focus', () => {
    const { getByPlaceholderText, getByDisplayValue } = render(React.createElement(MyWorkoutPlan));

    const minsInput = getByPlaceholderText('0');
    const secsInput = getByPlaceholderText('00');

    fireEvent.changeText(minsInput, '1a2');
    fireEvent.changeText(secsInput, '99');
    fireEvent(minsInput, 'focus');
    fireEvent(secsInput, 'focus');
    fireEvent(secsInput, 'blur');

    jestExpect(getByDisplayValue('12')).toBeTruthy();
    jestExpect(getByDisplayValue('59')).toBeTruthy();
    jestExpect(mockModalOpen).toHaveBeenNthCalledWith(1, 2);
    jestExpect(mockModalOpen).toHaveBeenNthCalledWith(2, 2);
  });

  jestIt('saves cardio with the selected type and parsed numeric values', async () => {
    const { getByText, getByPlaceholderText } = render(React.createElement(MyWorkoutPlan));

    fireEvent.press(getByText('Run'));
    fireEvent.changeText(getByPlaceholderText('0'), '12');
    fireEvent.changeText(getByPlaceholderText('00'), '61');
    fireEvent(getByPlaceholderText('00'), 'blur');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      jestExpect(mockLogUserCardio).toHaveBeenCalledWith(12, 59, 'Run');
    });
    jestExpect(mockCardioContext.setDailyCardioMap).toHaveBeenCalled();
    jestExpect(mockCardioContext.setWeeklyCardioMap).toHaveBeenCalled();
    jestExpect(Keyboard.dismiss).toHaveBeenCalled();
    jestExpect(mockModalClose).toHaveBeenCalled();
    jestExpect(mockShowNotification).toHaveBeenCalledWith(
      jestExpect.objectContaining({
        title: 'Cardio logged',
        description: 'Cardio added successfully',
      }),
    );
    jestExpect(mockReplace).toHaveBeenCalledWith('Statistics');
  });

  jestIt('renders the exercises modal list from filteredExercises', () => {
    const { getByText } = render(React.createElement(MyWorkoutPlan));

    jestExpect(getByText('Exercises')).toBeTruthy();
    jestExpect(getByText('Incline Bench Press')).toBeTruthy();
  });
});
