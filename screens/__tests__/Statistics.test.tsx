/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import type { TrackingMapItem } from '@strong-together/shared';
import type { WeeklyData } from '@strong-together/shared';

let mockStatisticsLogic: {
  selectedDate: string;
  setSelectedDate: ReturnType<typeof jest.fn>;
  exerciseTrackingByDate: Array<Omit<TrackingMapItem, 'workoutdate'>> | undefined;
  exerciseTrackingByDatePrev: (TrackingMapItem & { isLastWorkout: boolean })[];
  exerciseTrackingWithDateKey: Record<string, Array<Omit<TrackingMapItem, 'workoutdate'>>> | null;
  cardioByDate: WeeklyData['records'] | undefined;
  cardioForWeek: WeeklyData | undefined;
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

jest.mock('../../context/GlobalAppLoadingContext', () => ({
  useGlobalAppLoadingContext: () => mockLoadingState,
}));

jest.mock('../../hooks/logic/useStatisticsPageLogic', () => ({
  __esModule: true,
  default: () => mockStatisticsLogic,
}));

jest.mock('../../components/StatisticsComponents/CalenderStripCustom', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return ({ selectedDate }: { selectedDate: string }) =>
    ReactLocal.createElement(TextLocal, null, `Calendar ${selectedDate}`);
});

jest.mock('../../components/StatisticsComponents/TabSelect', () => {
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

jest.mock('../../components/StatisticsComponents/WorkoutHeader', () => (props: any) => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  mockWorkoutHeader(props);
  return ReactLocal.createElement(TextLocal, null, `WorkoutHeader ${props.selectedDate}`);
});

jest.mock('../../components/StatisticsComponents/ExercisesFlatList', () => (props: any) => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  mockExercisesFlatList(props);
  return ReactLocal.createElement(TextLocal, null, `Exercises ${props.data?.length ?? 0}`);
});

jest.mock('../../components/StatisticsComponents/CardioSection', () => (props: any) => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  mockCardioSection(props);
  return ReactLocal.createElement(TextLocal, null, `Cardio ${props.daily?.length ?? 0}`);
});

import Statistics from '../Statistics';

const createTrackingItem = (overrides: Partial<TrackingMapItem> = {}): TrackingMapItem => ({
  id: 1,
  exercisetosplit_id: 10,
  exercise_id: 15,
  workoutsplit_id: 3,
  splitname: 'Push',
  exercise: 'Bench Press',
  workoutdate: '2026-03-26',
  order_index: 1,
  weight: [100],
  reps: [8],
  notes: 'Strong set',
  exercisetoworkoutsplit: {
    sets: [8],
    exercises: {
      targetmuscle: 'Chest',
      specifictargetmuscle: 'Upper',
    },
  },
  ...overrides,
});

const createWeeklyData = (): WeeklyData => ({
  records: [
    { duration_mins: 20, duration_sec: 0, type: 'Run', workout_time_utc: '2026-03-23' },
    { duration_mins: 10, duration_sec: 0, type: 'Bike', workout_time_utc: '2026-03-25' },
  ],
  total_duration_mins: 30,
  total_duration_sec: 1800,
});

describe('Statistics screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadingState = { isLoading: false };
    mockStatisticsLogic = {
      selectedDate: '2026-03-26',
      setSelectedDate: jest.fn(),
      exerciseTrackingByDate: [createTrackingItem()],
      exerciseTrackingByDatePrev: [{ ...createTrackingItem({ workoutdate: '2026-03-20' }), isLastWorkout: true }],
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
      cardioByDate: createWeeklyData().records,
      cardioForWeek: createWeeklyData(),
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
