/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import type { ExercisesDuringWorkout } from '../../types/use-start-workout.types';
import type { TrackingMapItem } from '@strong-together/shared';
import type { ExerciseInPlan } from '@strong-together/shared';

let mockLastWorkoutData: TrackingMapItem | null = null;

jestObject.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => mockReact.createElement(Text, null, name),
  };
});

jestObject.mock('../../Timer', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ startTime, pausedTotal }: { startTime?: number; pausedTotal?: number }) =>
    mockReact.createElement(Text, null, `Timer ${startTime ?? 0}/${pausedTotal ?? 0}`);
});

jestObject.mock('../../AdherenceBar', () => ({
  AdherenceBar: ({ actual, planned }: { actual: number; planned: number }) => {
    const ReactLocal = require('react');
    const { Text } = require('react-native');
    return ReactLocal.createElement(Text, null, `Adherence ${actual}/${planned}`);
  },
}));

jestObject.mock('../../PercentageCircle', () => {
  const mockReact = require('react');
  const { View: ViewLocal } = require('react-native');
  return ({ children }: { children: React.ReactNode }) => mockReact.createElement(ViewLocal, null, children);
});

jestObject.mock('../../NumberCounter', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ numEnd }: { numEnd: number }) => mockReact.createElement(Text, null, String(numEnd));
});

jestObject.mock('../../PageDots', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');
  return ({ index = 0, length = 0 }: { index?: number; length?: number }) =>
    mockReact.createElement(Text, null, `Dots ${index}/${length}`);
});

jestObject.mock('../../../hooks/use-last-workout-exercise-tracking-data.hook', () => ({
  __esModule: true,
  default: () => ({
    lastWorkoutData: mockLastWorkoutData,
  }),
}));

jestObject.mock('../NumericInputWithRules', () => {
  const mockReact = require('react');
  const { TouchableOpacity: TouchableOpacityLocal, Text: TextLocal } = require('react-native');
  return ({
    initial,
    keyboardType,
    allowZero,
    isSetLocked,
    onValidChange,
  }: {
    initial?: number | string;
    keyboardType?: string;
    allowZero?: boolean;
    isSetLocked?: boolean;
    onValidChange?: (value: number) => void;
  }) =>
    mockReact.createElement(
      TouchableOpacityLocal,
      {
        disabled: Boolean(isSetLocked),
        onPress: () => onValidChange?.(99),
      },
      mockReact.createElement(
        TextLocal,
        null,
        `Numeric ${keyboardType ?? 'numeric'} ${String(initial)} ${String(Boolean(isSetLocked))} ${String(Boolean(allowZero))}`,
      ),
    );
});

jestObject.mock('react-native-keyboard-aware-scroll-view', () => {
  //const mockReact = require('react');
  const { FlatList } = require('react-native');
  return {
    KeyboardAwareFlatList: FlatList,
  };
});

import ExercisesSection from '../ExercisesSection';
import LastWorkoutData from '../LastWorkoutData';
import TopBar from '../TopBar';

const createExercise = (overrides: Partial<ExerciseInPlan> = {}): ExerciseInPlan => ({
  id: 11,
  sets: [10, 12],
  is_active: true,
  targetmuscle: 'Chest',
  specifictargetmuscle: 'Upper Chest',
  exercise: 'Bench Press',
  workoutsplit: 'Push',
  ...overrides,
});

const createTrackingMapItem = (overrides: Partial<TrackingMapItem> = {}): TrackingMapItem => ({
  id: 90,
  exercisetosplit_id: 11,
  exercise_id: 1,
  workoutsplit_id: 5,
  splitname: 'Push',
  exercise: 'Bench Press',
  workoutdate: '2026-03-26T10:00:00.000Z',
  order_index: 0,
  weight: [80, 85],
  reps: [10, 8],
  notes: 'Controlled reps',
  exercisetoworkoutsplit: {
    sets: [10, 12],
    exercises: {
      targetmuscle: 'Chest',
      specifictargetmuscle: 'Upper Chest',
    },
  },
  ...overrides,
});

const createWorkoutProgress = (overrides: Partial<ExercisesDuringWorkout[string]> = {}): ExercisesDuringWorkout => ({
  'Bench Press': {
    etsid: 11,
    weight: [80],
    reps: [10],
    notes: null,
    ...overrides,
  },
});

jestDescribe('StartWorkout components', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockLastWorkoutData = null;
  });

  jestDescribe('TopBar', () => {
    jestIt('renders workout progress, timer, and action buttons', () => {
      const { getByText } = render(
        <TopBar
          workoutName="Push"
          totalSets={4}
          setsDone={2}
          timerProps={{ startTime: 1000, pausedTotal: 200 }}
          saveWorkout={jestObject.fn(async () => undefined)}
          onExit={jestObject.fn(async () => undefined)}
          isSaving={false}
        />,
      );

      jestExpect(getByText('Workout Push')).toBeTruthy();
      jestExpect(getByText('50%')).toBeTruthy();
      jestExpect(getByText('Timer 1000/200')).toBeTruthy();
      jestExpect(getByText('Adherence 2/4')).toBeTruthy();
      jestExpect(getByText('50% Completed')).toBeTruthy();
      jestExpect(getByText('Finish')).toBeTruthy();
      jestExpect(getByText('Quit')).toBeTruthy();
    });

    jestIt('calls saveWorkout and onExit from the action buttons', () => {
      const saveWorkout = jestObject.fn(async () => undefined);
      const onExit = jestObject.fn(async () => undefined);
      const { getByText } = render(
        <TopBar
          workoutName="Push"
          totalSets={4}
          setsDone={2}
          timerProps={{ startTime: 1000, pausedTotal: 0 }}
          saveWorkout={saveWorkout}
          onExit={onExit}
          isSaving={false}
        />,
      );

      fireEvent.press(getByText('Finish'));
      fireEvent.press(getByText('Quit'));

      jestExpect(saveWorkout).toHaveBeenCalledTimes(1);
      jestExpect(onExit).toHaveBeenCalledTimes(1);
    });

    jestIt('shows the saving spinner and disables both buttons while saving', () => {
      const { queryByText, UNSAFE_getByType, UNSAFE_getAllByType } = render(
        <TopBar
          workoutName="Push"
          totalSets={4}
          setsDone={2}
          timerProps={{ startTime: 1000, pausedTotal: 0 }}
          saveWorkout={jestObject.fn(async () => undefined)}
          onExit={jestObject.fn(async () => undefined)}
          isSaving={true}
        />,
      );

      jestExpect(queryByText('Finish')).toBeNull();
      jestExpect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      const buttons = UNSAFE_getAllByType(TouchableOpacity);
      jestExpect(buttons[0].props.disabled).toBe(true);
      jestExpect(buttons[1].props.disabled).toBe(true);
    });

    jestIt('renders the current NaN progress text when total sets are zero', () => {
      const { getAllByText } = render(
        <TopBar
          workoutName="Recovery"
          totalSets={0}
          setsDone={0}
          timerProps={{ startTime: 0, pausedTotal: 0 }}
          saveWorkout={jestObject.fn(async () => undefined)}
          onExit={jestObject.fn(async () => undefined)}
          isSaving={false}
        />,
      );

      jestExpect(getAllByText('NaN%').length).toBeGreaterThanOrEqual(1);
      jestExpect(getAllByText('NaN% Completed').length).toBe(1);
    });
  });

  jestDescribe('LastWorkoutData', () => {
    jestIt('renders the empty state when no history is available', () => {
      const { getByText } = render(<LastWorkoutData lastWorkoutDataForModal={null} />);

      jestExpect(getByText('No previous data found')).toBeTruthy();
      jestExpect(getByText('Once you complete a set for this exercise, it will appear here.')).toBeTruthy();
    });

    jestIt('renders the selected set metrics and notes when history exists', () => {
      const { getByText } = render(
        <LastWorkoutData
          lastWorkoutDataForModal={{
            lastWorkoutData: createTrackingMapItem(),
            setIndex: 1,
          }}
        />,
      );

      jestExpect(getByText('Bench Press')).toBeTruthy();
      jestExpect(getByText('Weight')).toBeTruthy();
      jestExpect(getByText('85 kg')).toBeTruthy();
      jestExpect(getByText('8')).toBeTruthy();
      jestExpect(getByText('Controlled reps')).toBeTruthy();
    });

    jestIt('falls back for out-of-range set values and null notes', () => {
      const { getByText, queryByText } = render(
        <LastWorkoutData
          lastWorkoutDataForModal={{
            lastWorkoutData: createTrackingMapItem({
              weight: [80],
              reps: [10],
              notes: null,
            }),
            setIndex: 3,
          }}
        />,
      );

      jestExpect(getByText('Not recorded kg')).toBeTruthy();
      jestExpect(queryByText('10')).toBeNull();
      jestExpect(getByText('None')).toBeTruthy();
    });
  });

  jestDescribe('ExercisesSection', () => {
    jestIt('renders a loading state when exercises are still missing', () => {
      const { getByText, UNSAFE_getByType } = render(
        <ExercisesSection
          exercises={[]}
          exercisesSetsDoneMap={{}}
          controls={{
            addNotes: jestObject.fn(),
            addRepsRecord: jestObject.fn(),
            addWeightRecord: jestObject.fn(),
          }}
          workoutProgressObj={{}}
          setLastWorkoutDataForModal={jestObject.fn()}
          openModal={jestObject.fn()}
          openAnalyzeModal={jestObject.fn()}
        />,
      );

      jestExpect(getByText('Loading exercises...')).toBeTruthy();
      jestExpect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    jestIt(
      'renders in-progress and locked sets, updates notes, and opens last-workout history for the active set',
      () => {
        const addNotes = jestObject.fn();
        const addRepsRecord = jestObject.fn();
        const addWeightRecord = jestObject.fn();
        const setLastWorkoutDataForModal = jestObject.fn();
        const openModal = jestObject.fn();
        const openAnalyzeModal = jestObject.fn();
        mockLastWorkoutData = createTrackingMapItem();

        const { getByPlaceholderText, getAllByText, getByText, UNSAFE_getAllByType } = render(
          <ExercisesSection
            exercises={[createExercise()]}
            exercisesSetsDoneMap={{ 'Bench Press': { done: 0, planned: 2 } }}
            controls={{ addNotes, addRepsRecord, addWeightRecord }}
            workoutProgressObj={createWorkoutProgress()}
            setLastWorkoutDataForModal={setLastWorkoutDataForModal}
            openModal={openModal}
            openAnalyzeModal={openAnalyzeModal}
          />,
        );

        jestExpect(getAllByText('Bench Press').length).toBeGreaterThanOrEqual(1);
        jestExpect(getAllByText('0 of 2 completed').length).toBe(1);
        jestExpect(getAllByText('Set 1').length).toBeGreaterThanOrEqual(2);
        jestExpect(getAllByText('Dots 0/2').length).toBe(1);
        jestExpect(getAllByText('lock').length).toBeGreaterThanOrEqual(1);
        jestExpect(getAllByText('Numeric numeric 80 false false').length).toBe(1);
        jestExpect(getAllByText('Numeric numeric 0 true false').length).toBe(1);

        fireEvent.press(getAllByText('Numeric numeric 80 false false')[0]);
        fireEvent.press(getAllByText('Numeric number-pad 10 false false')[0]);
        fireEvent.press(getByText('Analyze movement'));
        fireEvent(getByPlaceholderText('Add any notes...'), 'endEditing', {
          nativeEvent: { text: 'Explosive reps' },
        });

        const touchables = UNSAFE_getAllByType(TouchableOpacity);
        fireEvent.press(touchables[0]);
        fireEvent.press(touchables[1]);

        jestExpect(addWeightRecord).toHaveBeenCalledWith('Bench Press', 0, 99);
        jestExpect(addRepsRecord).toHaveBeenCalledWith('Bench Press', 0, 99);
        jestExpect(openAnalyzeModal).toHaveBeenCalledWith(jestExpect.objectContaining({ exercise: 'Bench Press' }));
        jestExpect(addNotes).toHaveBeenCalledWith('Bench Press', 'Explosive reps');
        jestExpect(setLastWorkoutDataForModal).toHaveBeenCalledWith({
          lastWorkoutData: mockLastWorkoutData,
          setIndex: 0,
        });
        jestExpect(openModal).toHaveBeenCalledTimes(1);
        jestExpect(setLastWorkoutDataForModal).toHaveBeenCalledTimes(1);
      },
    );

    jestIt('renders the completed state and allows zero resets on the last completed set', () => {
      const { getByText } = render(
        <ExercisesSection
          exercises={[createExercise({ sets: [10] })]}
          exercisesSetsDoneMap={{ 'Bench Press': { done: 1, planned: 1 } }}
          controls={{
            addNotes: jestObject.fn(),
            addRepsRecord: jestObject.fn(),
            addWeightRecord: jestObject.fn(),
          }}
          workoutProgressObj={createWorkoutProgress()}
          setLastWorkoutDataForModal={jestObject.fn()}
          openModal={jestObject.fn()}
          openAnalyzeModal={jestObject.fn()}
        />,
      );

      jestExpect(getByText('Done')).toBeTruthy();
      jestExpect(getByText('check')).toBeTruthy();
      jestExpect(getByText('1 of 1 completed')).toBeTruthy();
      jestExpect(getByText('Numeric numeric 80 false true')).toBeTruthy();
      jestExpect(getByText('Numeric number-pad 10 false true')).toBeTruthy();
    });

    jestIt('renders safely when the exercise exists but its derived set counter is missing', () => {
      const { getByText, queryByText } = render(
        <ExercisesSection
          exercises={[createExercise()]}
          exercisesSetsDoneMap={{}}
          controls={{
            addNotes: jestObject.fn(),
            addRepsRecord: jestObject.fn(),
            addWeightRecord: jestObject.fn(),
          }}
          workoutProgressObj={createWorkoutProgress()}
          setLastWorkoutDataForModal={jestObject.fn()}
          openModal={jestObject.fn()}
          openAnalyzeModal={jestObject.fn()}
        />,
      );

      jestExpect(getByText('0 of 0 completed')).toBeTruthy();
      jestExpect(getByText('Set 1')).toBeTruthy();
      jestExpect(queryByText('Numeric numeric 80 false false')).toBeNull();
    });
  });
});

