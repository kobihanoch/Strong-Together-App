/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import MyWorkoutPlan from '../MyWorkoutPlan';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');
jest.mock('moti/skeleton', () => {
  const mockReact = require('react');
  const { View: MockView } = require('react-native');
  return { Skeleton: (props: any) => mockReact.createElement(MockView, props) };
});
jest.mock('../../../../../shared/providers/AppThemeProvider', () => ({
  useAppTheme: () => ({ colors: mockTheme }),
}));

const mockActions = {
  selectSplit: jest.fn(),
  createPlan: jest.fn(),
  editPlan: jest.fn(),
  startWorkout: jest.fn(),
};

const mockTheme = {
  canvas: '#FAF8F5', surface: '#FFF', surfaceMuted: '#F2EEE8', border: '#E7E0D8', textPrimary: '#17130F',
  textSecondary: '#756B61', primary: '#2977FF', primarySoft: '#EAF2FF', achievement: '#E9A23B',
  achievementSoft: '#FFF5E5', heroSurface: '#17130F', heroOverlay: 'rgba(0,0,0,.5)', white: '#FFF', profit: '#080',
};

const exercise = {
  exerciseToSplitId: 101,
  exerciseId: 11,
  name: 'Bench Press',
  sets: [{ orderIndex: 0, reps: 10 }, { orderIndex: 1, reps: 8 }],
  orderIndex: 0,
  isActive: true,
  targetMuscle: 'Chest',
  specificTargetMuscle: 'Upper chest',
};

const split = {
  id: 1, workoutId: 1, name: 'Push Day', orderIndex: 0, createdAt: '2026-08-01', muscleGroup: 'Chest',
  estimatedDurationMinutes: 52, isActive: true, exercises: [exercise],
};

let mockLogic: any;

jest.mock('../../hooks/use-my-workout-plan.hook', () => ({
  __esModule: true,
  default: () => mockLogic,
}));

describe('MyWorkoutPlan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogic = {
      data: {
        theme: mockTheme,
        isPending: false,
        isLoading: false,
        hasWorkoutPlan: true,
        workoutPlan: { numberOfSplits: 1 },
        workoutSplits: [split],
        selectedSplit: split,
        setCount: 2,
        muscles: ['Chest'],
        hasTrainedToday: false,
        completedThisWeek: 2,
        weeklyTarget: 4,
        weekDays: [
          { label: 'M', date: '2026-08-31', trained: true, isToday: false },
          { label: 'T', date: '2026-09-01', trained: false, isToday: true },
        ],
        lastCompletedDate: null,
        exercisePerformanceByAssignmentId: {
          '101': {
            exerciseTracked: [{
              workoutDate: '2026-08-27',
              exerciseTracking: {
                exerciseTrackingId: 9,
                sets: [{ setIndex: 0, weight: 60, reps: 10 }, { setIndex: 1, weight: 65, reps: 8 }],
                notes: null,
                exerciseAssignment: {
                  exerciseToSplitId: 101, orderIndex: 0, exerciseId: 11, workoutSplitId: 1,
                  workoutSplitName: 'Push Day', exerciseName: 'Bench Press', targetMuscle: 'Chest', specificTargetMuscle: 'Upper chest',
                },
              },
            }],
          },
        },
      },
      actions: mockActions,
    };
  });

  it('renders the plan summary without obsolete controls', () => {
    const { getAllByText, getByText, queryByText, queryByLabelText } = render(<MyWorkoutPlan />);

    expect(getAllByText('Push Day')).toHaveLength(2);
    expect(getByText('2 of 4')).toBeTruthy();
    expect(getByText('~52 min')).toBeTruthy();
    expect(getByText('Start workout')).toBeTruthy();
    expect(getByText('Edit')).toBeTruthy();
    expect(queryByText('BARBELL')).toBeNull();
    expect(queryByLabelText('More options')).toBeNull();
  });

  it('renders the workout-plan skeleton while data is pending', () => {
    mockLogic.data.isPending = true;
    const { getByLabelText, queryByText } = render(<MyWorkoutPlan />);

    expect(getByLabelText('Loading workout plan')).toBeTruthy();
    expect(queryByText('Workout Plan')).toBeNull();
  });

  it('expands a row to show its mocked last performance', () => {
    const { getByText, queryByText } = render(<MyWorkoutPlan />);

    expect(queryByText('LAST PERFORMANCE')).toBeNull();
    fireEvent.press(getByText('Bench Press'));
    expect(getByText('LAST PERFORMANCE')).toBeTruthy();
    expect(getByText('60 kg × 10')).toBeTruthy();
    expect(getByText('65 kg × 8')).toBeTruthy();
    fireEvent.press(getByText('Bench Press'));
    expect(queryByText('LAST PERFORMANCE')).toBeNull();
  });

  it('routes the primary and edit actions', () => {
    const { getByText } = render(<MyWorkoutPlan />);
    fireEvent.press(getByText('Start workout'));
    fireEvent.press(getByText('Edit'));
    expect(mockActions.startWorkout).toHaveBeenCalledTimes(1);
    expect(mockActions.editPlan).toHaveBeenCalledTimes(1);
  });

  it('renders the empty-plan state', () => {
    mockLogic.data.hasWorkoutPlan = false;
    const { getByText } = render(<MyWorkoutPlan />);
    fireEvent.press(getByText('Create workout'));
    expect(mockActions.createPlan).toHaveBeenCalledTimes(1);
  });
});
