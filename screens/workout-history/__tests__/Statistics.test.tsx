/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import type { TrackingMapItem } from '../../../shared/types/workout.types';
import type { CardioWeeklyData } from '../../../cardio/types/cardio.types';

let mockStatisticsLogic: {
  selectedDate: string;
  setSelectedDate: ReturnType<typeof jest.fn>;
  exerciseTrackingByDate: Array<Omit<TrackingMapItem, 'workoutDate'>> | undefined;
  exerciseTrackingByDatePrev: (TrackingMapItem & { isLastWorkout: boolean })[];
  exerciseTrackingWithDateKey: Record<string, Array<Omit<TrackingMapItem, 'workoutDate'>>> | null;
  cardioByDate: CardioWeeklyData['records'] | undefined;
  cardioForWeek: CardioWeeklyData | undefined;
};

let mockLoadingState: { isLoading: boolean };
const mockShowCardioDot = jest.fn();
const mockHideCardioDot = jest.fn();
const mockTabSelectRender = jest.fn();
const mockExercisesFlatList = jest.fn((_props: any) => null);
const mockCardioSection = jest.fn((_props: any) => null);
const mockWorkoutHeader = jest.fn((_props: any) => null);

jest.mock('react-native-gesture-handler', () => {
  const { ScrollView: ScrollViewLocal } = require('react-native');
  return { ScrollView: ScrollViewLocal };
});

jest.mock('../../../../../shared/providers/GlobalAppLoadingProvider', () => ({
  useGlobalAppLoadingContext: () => mockLoadingState,
}));

jest.mock('../../hooks/use-statistics-page-logic.hook', () => ({
  __esModule: true,
  default: () => mockStatisticsLogic,
}));

jest.mock('../../components/CalenderStripCustom', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return ({ selectedDate }: { selectedDate: string }) =>
    ReactLocal.createElement(TextLocal, null, `Calendar ${selectedDate}`);
});

jest.mock('../../components/TabSelect', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return ReactLocal.forwardRef(
    ({ index, setIndex }: { index: number; setIndex: (index: number) => void }, ref: any) => {
      mockTabSelectRender({ index, setIndex });
      ReactLocal.useImperativeHandle(ref, () => ({
        showCardioDot: mockShowCardioDot,
        hideCardioDot: mockHideCardioDot,
      }));
      return ReactLocal.createElement(TextLocal, null, `TabSelect ${index}`);
    },
  );
});

jest.mock('../../components/WorkoutHeader', () => (props: any) => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  mockWorkoutHeader(props);
  return ReactLocal.createElement(TextLocal, null, `WorkoutHeader ${props.selectedDate}`);
});

jest.mock('../../components/ExercisesFlatList', () => (props: any) => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  mockExercisesFlatList(props);
  return ReactLocal.createElement(TextLocal, null, `Exercises ${props.data?.length ?? 0}`);
});

jest.mock('../../../cardio/components/CardioSection', () => (props: any) => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  mockCardioSection(props);
  return ReactLocal.createElement(TextLocal, null, `Cardio ${props.daily?.length ?? 0}`);
});

import Statistics from '../Statistics';

const createTrackingItem = (overrides: Partial<TrackingMapItem> = {}): TrackingMapItem => ({
  id: 1,
  exerciseToSplitId: 10,
  exerciseId: 15,
  workoutSplitId: 3,
  splitName: 'Push',
  exercise: 'Bench Press',
  workoutDate: '2026-03-26',
  orderIndex: 1,
  weight: [100],
  reps: [8],
  notes: 'Strong set',
  exerciseToWorkoutSplit: {
    sets: [8],
    exercises: {
      targetMuscle: 'Chest',
      specificTargetMuscle: 'Upper',
    },
  },
  ...overrides,
});

const createCardioWeeklyData = (): CardioWeeklyData => ({
  records: [
    { durationMins: 20, durationSec: 0, type: 'Run', workoutTimeUtc: '2026-03-23' },
    { durationMins: 10, durationSec: 0, type: 'Bike', workoutTimeUtc: '2026-03-25' },
  ],
  totalDurationMins: 30,
  totalDurationSec: 1800,
});

describe('Statistics screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadingState = { isLoading: false };
    mockStatisticsLogic = {
      selectedDate: '2026-03-26',
      setSelectedDate: jest.fn(),
      exerciseTrackingByDate: [createTrackingItem()],
      exerciseTrackingByDatePrev: [{ ...createTrackingItem({ workoutDate: '2026-03-20' }), isLastWorkout: true }],
      exerciseTrackingWithDateKey: {
        '2026-03-26': [createTrackingItem()],
      },
      cardioByDate: undefined,
      cardioForWeek: undefined,
    };
  });

  it('returns null while the global loading state is still active', () => {
    mockLoadingState = { isLoading: true };

    const { toJSON } = render(<Statistics />);

    expect(toJSON()).toBeNull();
  });

  it('renders the workout branch by default when exercise logs exist for the selected date', () => {
    const { getByText } = render(<Statistics />);

    expect(getByText('Calendar 2026-03-26')).toBeTruthy();
    expect(getByText('TabSelect 0')).toBeTruthy();
    expect(getByText('WorkoutHeader 2026-03-26')).toBeTruthy();
    expect(getByText('Exercises 1')).toBeTruthy();
    expect(mockShowCardioDot).not.toHaveBeenCalled();
    expect(mockHideCardioDot).toHaveBeenCalledTimes(1);
    expect(mockWorkoutHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockStatisticsLogic.exerciseTrackingByDate,
        selectedDate: '2026-03-26',
      }),
    );
    expect(mockExercisesFlatList).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockStatisticsLogic.exerciseTrackingByDate,
        dataToCompare: mockStatisticsLogic.exerciseTrackingByDatePrev,
      }),
    );
  });

  it('switches automatically to the cardio branch when the selected date has no workout logs but has cardio data', () => {
    mockStatisticsLogic = {
      ...mockStatisticsLogic,
      exerciseTrackingByDate: [],
      cardioByDate: createCardioWeeklyData().records,
      cardioForWeek: createCardioWeeklyData(),
    };

    const { getByText, queryByText } = render(<Statistics />);

    expect(getByText('TabSelect 1')).toBeTruthy();
    expect(queryByText('WorkoutHeader 2026-03-26')).toBeNull();
    expect(getByText('Cardio 2')).toBeTruthy();
    expect(mockShowCardioDot).toHaveBeenCalledTimes(1);
    expect(mockCardioSection).toHaveBeenCalledWith(
      expect.objectContaining({
        daily: mockStatisticsLogic.cardioByDate,
        weekly: mockStatisticsLogic.cardioForWeek,
      }),
    );
  });

  it('stays on the exercise branch and passes empty arrays through when both workout and cardio data are missing', () => {
    mockStatisticsLogic = {
      ...mockStatisticsLogic,
      exerciseTrackingByDate: [],
      exerciseTrackingByDatePrev: [],
      cardioByDate: undefined,
      cardioForWeek: undefined,
      exerciseTrackingWithDateKey: null,
    };

    const { getByText } = render(<Statistics />);

    expect(getByText('TabSelect 0')).toBeTruthy();
    expect(getByText('WorkoutHeader 2026-03-26')).toBeTruthy();
    expect(getByText('Exercises 0')).toBeTruthy();
    expect(mockHideCardioDot).toHaveBeenCalledTimes(1);
  });
});

