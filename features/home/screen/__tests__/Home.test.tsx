/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable react/display-name */
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import Home from '../Home';

const mockActions = {
  openInbox: jest.fn(), createWorkout: jest.fn(), startWorkout: jest.fn(),
  openProgress: jest.fn(), openHistory: jest.fn(),
};
let mockLogic: any;

jest.mock('moti/skeleton', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Skeleton = ({ children }: any) => React.createElement(View, { testID: 'skeleton' }, children);
  Skeleton.Group = ({ children, show }: any) =>
    React.createElement(View, { testID: show ? 'skeleton-group-loading' : 'skeleton-group-ready' }, children);
  return { Skeleton };
});
jest.mock('../../../../shared/providers/AppThemeProvider', () => ({ useAppTheme: () => ({ mode: 'light' }) }));
jest.mock('../../hooks/use-home-dashboard.hook', () => ({ __esModule: true, default: () => mockLogic }));
jest.mock('../../components/HomeHeader', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text onPress={props.onInbox}>Welcome, {props.data.displayName}</Text>;
});
jest.mock('../../components/NextWorkoutCard', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text onPress={props.onStart}>Next: {props.data.name}</Text>;
});
jest.mock('../../components/NoWorkoutCard', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text onPress={props.onCreate}>Create workout</Text>;
});
jest.mock('../../components/NoTrackingCard', () => () => {
  const { Text } = require('react-native');
  return <Text>No tracking</Text>;
});
jest.mock('../../components/GymActivityCard', () => () => {
  const { View } = require('react-native');
  return <View testID="gym-card" />;
});
jest.mock('../../components/AerobicsCard', () => () => {
  const { View } = require('react-native');
  return <View testID="aerobics-card" />;
});
jest.mock('../../components/AchievementCard', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text onPress={props.onPress}>Achievement</Text>;
});
jest.mock('../../components/LastWorkoutCard', () => (props: any) => {
  const { Text } = require('react-native');
  return <Text onPress={props.onPress}>Last workout</Text>;
});

const data = {
  theme: { canvas: '#fff' },
  state: { hasWorkout: true, hasTracking: true },
  user: { displayName: 'John', profilePicPath: null, gender: 'Male', unreadCount: 1 },
  nextWorkout: { id: 12, name: 'B', orderIndex: 1, muscleGroup: 'Back', exerciseCount: 1, setCount: 3 },
  gymActivity: { completedThisWeek: 2, weeklyTarget: 3, weekStreak: 4 },
  lastWorkout: { name: 'A', dateLabel: 'Mar 27', exerciseCount: 5, setCount: 14 },
  aerobics: { totalMinutes: 25, days: [] },
  achievement: { exercise: 'Bench Press', value: '85 kg PR', estimatedOneRepMax: 107.7 },
};

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogic = { data, actions: mockActions, loadingStates: { isPending: false, isFetching: false } };
  });

  it('renders the loaded dashboard and connects its actions', () => {
    const { getByText, getByTestId } = render(<Home />);
    expect(getByTestId('skeleton-group-ready')).toBeTruthy();
    expect(getByTestId('gym-card')).toBeTruthy();
    expect(getByText('Next: B')).toBeTruthy();

    fireEvent.press(getByText('Welcome, John'));
    fireEvent.press(getByText('Next: B'));
    fireEvent.press(getByText('Achievement'));
    fireEvent.press(getByText('Last workout'));

    expect(mockActions.openInbox).toHaveBeenCalled();
    expect(mockActions.startWorkout).toHaveBeenCalled();
    expect(mockActions.openProgress).toHaveBeenCalled();
    expect(mockActions.openHistory).toHaveBeenCalled();
  });

  it('renders the full skeleton dashboard while loading', () => {
    mockLogic = { data, actions: mockActions, loadingStates: { isPending: true, isFetching: true } };
    const { getByTestId, getAllByTestId } = render(<Home />);

    expect(getByTestId('skeleton-group-loading')).toBeTruthy();
    expect(getAllByTestId('skeleton')).toHaveLength(6);
  });

  it('renders the create-workout state when no plan exists', () => {
    mockLogic = { data: { ...data, state: { hasWorkout: false, hasTracking: false } }, actions: mockActions, loadingStates: { isPending: false, isFetching: false } };
    const { getByText, queryByTestId } = render(<Home />);

    fireEvent.press(getByText('Create workout'));
    expect(mockActions.createWorkout).toHaveBeenCalled();
    expect(queryByTestId('gym-card')).toBeNull();
  });

  it('renders the no-tracking state for a plan without history', () => {
    mockLogic = { data: { ...data, state: { hasWorkout: true, hasTracking: false } }, actions: mockActions, loadingStates: { isPending: false, isFetching: false } };
    const { getByText, queryByTestId } = render(<Home />);

    expect(getByText('No tracking')).toBeTruthy();
    expect(queryByTestId('gym-card')).toBeNull();
  });
});
