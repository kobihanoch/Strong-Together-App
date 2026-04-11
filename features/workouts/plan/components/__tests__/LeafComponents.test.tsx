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
import { TouchableOpacity } from 'react-native';
import type { WorkoutPlanSplit } from '../../types/workout-plan.types';
import type { ExerciseInPlan } from '@strong-together/shared';

const mockNavigate = jestObject.fn();
let mockCardioContext: { hasDoneCardioToday: boolean };

jestObject.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => mockReact.createElement(Text, null, name);
});

jestObject.mock('../../../shared/providers/CardioProvider', () => ({
  useCardioContext: () => mockCardioContext,
}));

import StartWorkoutButton from '../StartWorkoutButton';
import StartCardioButton from '../../../cardio/components/StartCardioButton';
import RenderItemExercise from '../RenderItemExercise';
import NoWorkoutPlan from '../NoWorkoutPlan';

const createSplit = (
  overrides: Partial<WorkoutPlanSplit> = {},
): WorkoutPlanSplit => ({
  id: 1,
  name: 'Push',
  muscleGroup: 'Chest, Shoulders, Triceps',
  ...overrides,
});

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

jestDescribe('MyWorkoutPlan leaf components', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockCardioContext = { hasDoneCardioToday: false };
  });

  jestDescribe('StartWorkoutButton', () => {
    jestIt('navigates to StartWorkout with the selected split when training is allowed', () => {
      const selectedSplit = createSplit();
      const { getByText } = render(React.createElement(StartWorkoutButton, { hasTrainedToday: false, selectedSplit }));

      fireEvent.press(getByText('Start workout'));

      jestExpect(mockNavigate).toHaveBeenCalledWith('StartWorkout', {
        workoutSplit: selectedSplit,
      });
    });

    jestIt('shows the locked state and prevents navigation when the user already trained today', () => {
      const { getByText, UNSAFE_getByType } = render(
        React.createElement(StartWorkoutButton, {
          hasTrainedToday: true,
          selectedSplit: createSplit(),
        }),
      );

      fireEvent.press(getByText('Already trained today'));

      jestExpect(getByText('lock')).toBeTruthy();
      jestExpect(UNSAFE_getByType(TouchableOpacity).props.disabled).toBe(true);
      jestExpect(mockNavigate).not.toHaveBeenCalled();
    });

    jestIt('stays disabled when there is no selected split yet', () => {
      const { getByText, UNSAFE_getByType } = render(
        React.createElement(StartWorkoutButton, {
          hasTrainedToday: false,
          selectedSplit: null,
        }),
      );

      fireEvent.press(getByText('Start workout'));

      jestExpect(UNSAFE_getByType(TouchableOpacity).props.disabled).toBe(true);
      jestExpect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  jestDescribe('StartCardioButton', () => {
    jestIt('opens the cardio modal on the logging form when cardio was not done today', () => {
      const openCardioModal = jestObject.fn();
      const { getByText } = render(React.createElement(StartCardioButton, { openCardioModal }));

      fireEvent.press(getByText('Log daily cardio'));

      jestExpect(openCardioModal).toHaveBeenCalledWith(1);
    });

    jestIt('opens the cardio modal on the summary state when cardio was already done today', () => {
      mockCardioContext = { hasDoneCardioToday: true };
      const openCardioModal = jestObject.fn();
      const { getByText } = render(React.createElement(StartCardioButton, { openCardioModal }));

      fireEvent.press(getByText('Log daily cardio'));

      jestExpect(openCardioModal).toHaveBeenCalledWith(0);
    });
  });

  jestDescribe('RenderItemExercise', () => {
    jestIt('renders exercise name, muscle details, and joined sets', () => {
      const { getByText } = render(React.createElement(RenderItemExercise, { item: createExercise() }));

      jestExpect(getByText('Incline Bench Press')).toBeTruthy();
      jestExpect(getByText('Chest, Upper Chest')).toBeTruthy();
      jestExpect(getByText('8 / 10 / 12')).toBeTruthy();
    });

    jestIt('renders safely when the specific muscle is an empty string', () => {
      const { getByText, queryByText } = render(
        React.createElement(RenderItemExercise, {
          item: createExercise({ specifictargetmuscle: '' }),
        }),
      );

      jestExpect(getByText('Chest')).toBeTruthy();
      jestExpect(queryByText('Chest, ')).toBeNull();
    });
  });

  jestDescribe('NoWorkoutPlan', () => {
    jestIt('renders the empty state copy and triggers create workout', () => {
      const onCreatePress = jestObject.fn();
      const { getByText } = render(React.createElement(NoWorkoutPlan, { onCreatePress }));

      fireEvent.press(getByText('Create workout'));

      jestExpect(getByText('No workout plan yet')).toBeTruthy();
      jestExpect(getByText('dumbbell')).toBeTruthy();
      jestExpect(onCreatePress).toHaveBeenCalledTimes(1);
    });
  });
});
