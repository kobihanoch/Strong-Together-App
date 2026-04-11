/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {
  expect,
  beforeEach as jestBeforeEach,
  describe as jestDescribe,
  expect as jestExpect,
  it as jestIt,
  jest as jestObject,
} from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { RootParamList } from '../../../../shared/navigation/types/appStackTypes';
import type { WorkoutPlanSplit } from '../../../plan/types/workout-plan.types';
import type {
  ResumeWorkoutCachePayload,
  StartWorkoutPageLogicReturn,
} from '../../types/use-start-workout.types';
import type { TrackingMapItem } from '@strong-together/shared';

const mockDialogShow = jestObject.fn();
const mockDialogHide = jestObject.fn();
const mockUseStartWorkoutPageLogic = jestObject.fn();
const mockLastWorkoutData = jestObject.fn((_: any) => null);
const mockAnalyzeExerciseSheet = jestObject.fn((_: any) => null);
const mockExercisesSection = jestObject.fn((_: any) => null);
const mockTopBar = jestObject.fn((_: any) => null);

const mockModalRegistry = {
  open: jestObject.fn(),
  close: jestObject.fn(),
  snapToIndex: jestObject.fn(),
};

jestObject.mock('react-native-alert-notification', () => ({
  ALERT_TYPE: {
    SUCCESS: 'success',
    WARNING: 'warning',
  },
  Dialog: {
    show: (...args: any[]) => mockDialogShow(...args),
    hide: (...args: any[]) => mockDialogHide(...args),
  },
}));

jestObject.mock('../../hooks/use-start-workout-page-logic.hook', () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseStartWorkoutPageLogic(...args),
}));

jestObject.mock('../../components/TopBar', () => (props: any) => mockTopBar(props));
jestObject.mock('../../components/ExercisesSection', () => (props: any) => mockExercisesSection(props));
jestObject.mock('../../components/LastWorkoutData', () => (props: any) => mockLastWorkoutData(props));
jestObject.mock('../../components/AnalyzeExerciseSheet', () => (props: any) => mockAnalyzeExerciseSheet(props));

jestObject.mock('../../../../../../shared/components/SlidingBottomModal', () => {
  const mockReact = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: mockReact.forwardRef(({ title, children }: any, ref: any) => {
      mockReact.useImperativeHandle(ref, () => mockModalRegistry);
      return mockReact.createElement(View, null, mockReact.createElement(Text, null, title), children);
    }),
  };
});

import StartWorkout from '../StartWorkout';

const createSplit = (
  overrides: Partial<WorkoutPlanSplit> = {},
): WorkoutPlanSplit => ({
  id: 5,
  name: 'Push',
  muscleGroup: 'Chest, Shoulders, Triceps',
  ...overrides,
});

const createResumedWorkout = (
  overrides: Partial<Omit<ResumeWorkoutCachePayload, 'selectedSplit'>> = {},
): Omit<ResumeWorkoutCachePayload, 'selectedSplit'> => ({
  workout: {
    'Bench Press': {
      etsid: 11,
      weight: [80],
      reps: [10],
      notes: null,
    },
  },
  startTime: 1000,
  lastPause: 0,
  pausedTotal: 0,
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
  weight: [80],
  reps: [10],
  notes: 'Strong',
  exercisetoworkoutsplit: {
    sets: [10],
    exercises: {
      targetmuscle: 'Chest',
      specifictargetmuscle: 'Upper Chest',
    },
  },
  ...overrides,
});

const createRoute = (): { params: RootParamList['StartWorkout'] } => ({
  params: {
    workoutSplit: createSplit(),
    resumedWorkout: createResumedWorkout(),
  },
});

const createLogicReturn = (overrides: Partial<StartWorkoutPageLogicReturn> = {}): StartWorkoutPageLogicReturn => ({
  data: {
    workoutName: 'Push',
    totalSets: 4,
    setsDone: 1,
    startTime: 1000,
    pausedTotal: 0,
    exercisesForSelectedSplit: [],
    setsDoneWithExerciseNameKey: {},
    ...(overrides.data ?? {}),
  },
  saving: {
    saveStarted: false,
    saveData: jestObject.fn(async () => undefined),
    ...(overrides.saving ?? {}),
  },
  controls: {
    addNotes: jestObject.fn(),
    addRepsRecord: jestObject.fn(),
    addWeightRecord: jestObject.fn(),
    ...(overrides.controls ?? {}),
  },
  workoutProgressObj: overrides.workoutProgressObj ?? {},
  onExit: overrides.onExit ?? jestObject.fn(async () => undefined),
});

jestDescribe('StartWorkout screen', () => {
  jestBeforeEach(() => {
    jestObject.clearAllMocks();
    mockUseStartWorkoutPageLogic.mockReturnValue(createLogicReturn());

    mockTopBar.mockImplementation(({ saveWorkout, onExit }: any) => {
      const ReactLocal = require('react');
      const { View, Text, TouchableOpacity } = require('react-native');
      return ReactLocal.createElement(
        View,
        null,
        ReactLocal.createElement(
          TouchableOpacity,
          { onPress: saveWorkout },
          ReactLocal.createElement(Text, null, 'Save'),
        ),
        ReactLocal.createElement(TouchableOpacity, { onPress: onExit }, ReactLocal.createElement(Text, null, 'Exit')),
      );
    });

    mockExercisesSection.mockImplementation(({ setLastWorkoutDataForModal, openModal, openAnalyzeModal }: any) => {
      const ReactLocal = require('react');
      const { View, TouchableOpacity, Text } = require('react-native');
      return ReactLocal.createElement(
        View,
        null,
        ReactLocal.createElement(
          TouchableOpacity,
          {
            onPress: () => {
              setLastWorkoutDataForModal({
                lastWorkoutData: createTrackingMapItem(),
                setIndex: 0,
              });
              openModal();
            },
          },
          ReactLocal.createElement(Text, null, 'Open history'),
        ),
        ReactLocal.createElement(
          TouchableOpacity,
          {
            onPress: () =>
              openAnalyzeModal({
                id: 11,
                sets: [10],
                is_active: true,
                targetmuscle: 'Chest',
                specifictargetmuscle: 'Upper Chest',
                exercise: 'Bench Press',
                workoutsplit: 'Push',
              }),
          },
          ReactLocal.createElement(Text, null, 'Open analysis'),
        ),
      );
    });
  });

  jestIt('passes the route params into use-start-workout-page-logic.hook and renders the modal shell', () => {
    const route = createRoute();
    const { getByText } = render(<StartWorkout route={route as any} navigation={{} as any} />);

    jestExpect(mockUseStartWorkoutPageLogic).toHaveBeenCalledWith(
      route.params.workoutSplit,
      route.params.resumedWorkout,
    );
    jestExpect(getByText('Last Performance')).toBeTruthy();
    jestExpect(getByText('AI Exercise Analysis')).toBeTruthy();
  });

  jestIt('opens the history modal and passes the selected workout data into LastWorkoutData', async () => {
    const { getByText } = render(<StartWorkout route={createRoute() as any} navigation={{} as any} />);

    fireEvent.press(getByText('Open history'));

    await waitFor(() => {
      jestExpect(mockModalRegistry.open).toHaveBeenCalledWith(0);
    });
    jestExpect(mockLastWorkoutData).toHaveBeenLastCalledWith({
      lastWorkoutDataForModal: {
        lastWorkoutData: expect.objectContaining({ exercise: 'Bench Press' }),
        setIndex: 0,
      },
    });
  });

  jestIt('opens the AI analysis modal and passes the selected exercise into the analysis sheet', async () => {
    const { getByText } = render(<StartWorkout route={createRoute() as any} navigation={{} as any} />);

    fireEvent.press(getByText('Open analysis'));

    await waitFor(() => {
      jestExpect(mockModalRegistry.open).toHaveBeenCalledWith(0);
    });
    jestExpect(mockAnalyzeExerciseSheet).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedExercise: expect.objectContaining({ exercise: 'Bench Press' }),
        analysisOverview: expect.objectContaining({ status: 'idle' }),
        onAnalysisOverviewChange: expect.any(Function),
      }),
    );
  });

  jestIt('shows the finish confirmation and saves the workout only after confirmation', async () => {
    const saveData = jestObject.fn(async () => undefined);
    mockUseStartWorkoutPageLogic.mockReturnValueOnce(
      createLogicReturn({
        saving: {
          saveStarted: false,
          saveData,
        },
      }),
    );

    const { getByText } = render(<StartWorkout route={createRoute() as any} navigation={{} as any} />);

    fireEvent.press(getByText('Save'));

    const dialogConfig = mockDialogShow.mock.calls.at(-1)?.[0] as any;
    jestExpect(dialogConfig.title).toBe('Finish Workout?');
    jestExpect(dialogConfig.button).toBe('Yes, Finish');

    await dialogConfig.onPressButton();

    jestExpect(mockDialogHide).toHaveBeenCalled();
    jestExpect(saveData).toHaveBeenCalledTimes(1);
  });

  jestIt('shows the exit confirmation and exits the workout only after confirmation', async () => {
    const onExit = jestObject.fn(async () => undefined);
    mockUseStartWorkoutPageLogic.mockReturnValueOnce(
      createLogicReturn({
        onExit,
      }),
    );

    const { getByText } = render(<StartWorkout route={createRoute() as any} navigation={{} as any} />);

    fireEvent.press(getByText('Exit'));

    const dialogConfig = mockDialogShow.mock.calls.at(-1)?.[0] as any;
    jestExpect(dialogConfig.title).toBe('Exit Workout?');
    jestExpect(dialogConfig.button).toBe('Yes, Exit');

    await dialogConfig.onPressButton();

    jestExpect(mockDialogHide).toHaveBeenCalled();
    jestExpect(onExit).toHaveBeenCalledTimes(1);
  });
});


