/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Home from '../Home';

const mockNavigate = jest.fn();
const mockFeatureState = { hasPlan: true, hasTracking: true, pending: false };

jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockNavigate }) }));
jest.mock('../../../shared/providers/AppThemeProvider', () => ({
  useAppTheme: () => ({ mode: 'light', colors: { canvas: '#fff' } }),
}));
jest.mock('../../../features/user/hooks/use-user.hook', () => ({
  useUser: () => ({ data: { name: 'John Smith', username: 'john', profilePicPath: null, gender: 'Male' }, loadingStates: { isPending: mockFeatureState.pending } }),
}));
jest.mock('../../../features/messages/hooks/use-messages.hook', () => ({
  useMessages: () => ({ data: { unreadMessages: [{ id: 1 }] }, loadingStates: { isPending: mockFeatureState.pending } }),
}));
jest.mock('../../../features/workouts/plan/hooks/use-workout-plan.hook', () => ({
  useWorkoutPlan: () => ({
    data: { hasWorkoutPlan: mockFeatureState.hasPlan, workoutSplits: mockFeatureState.hasPlan ? [{ id: 1, name: 'Push', orderIndex: 0, muscleGroup: 'Chest', exercises: [{ sets: [{ reps: 10 }] }] }] : [] },
    loadingStates: { isPending: mockFeatureState.pending },
  }),
}));
jest.mock('../../../features/workouts/cardio/hooks/use-cardio.hook', () => ({
  useCardio: () => ({
    data: { weeklyCardioMap: {}, cardioForSelectedWeek: () => null },
    loadingStates: { isPending: mockFeatureState.pending, isUpdating: false },
    actions: { logCardio: jest.fn() },
  }),
}));
jest.mock('../../../features/dashboard/use-dashboard.hook', () => ({
  __esModule: true,
  default: () => ({ data: { hasExerciseTracking: mockFeatureState.hasTracking, nextWorkoutSplit: { id: 1 }, workoutTargets: { workoutCountThisWeek: 2, workoutCountScheduledPerWeek: 4, weekStreak: 3 }, lastWorkoutStats: null, prs: [] }, loadingStates: { isPending: mockFeatureState.pending } }),
}));
jest.mock('moti/skeleton', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  const Skeleton = ({ children }: any) => ReactLocal.createElement(View, null, children);
  Skeleton.Group = ({ children }: any) => ReactLocal.createElement(View, null, children);
  return { Skeleton };
});
jest.mock('../components/HomeHeader', () => ({ data, onInbox }: any) => {
  const { Text } = require('react-native');
  return <Text onPress={onInbox}>Hello {data.displayName}</Text>;
});
jest.mock('../components/NextWorkoutCard', () => ({ data, onStart }: any) => {
  const { Text } = require('react-native');
  return <Text onPress={onStart}>Next {data.name}</Text>;
});
jest.mock('../components/NoWorkoutCard', () => ({ onCreate }: any) => {
  const { Text } = require('react-native');
  return <Text onPress={onCreate}>Create workout</Text>;
});
jest.mock('../components/NoTrackingCard', () => () => null);
jest.mock('../components/GymActivityCard', () => () => null);
jest.mock('../components/AerobicsCard', () => () => null);
jest.mock('../components/AchievementCard', () => () => null);
jest.mock('../components/LastWorkoutCard', () => () => null);
jest.mock('../../../features/workouts/cardio/components/CardioEntrySheet', () => () => null);

describe('Home integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockFeatureState, { hasPlan: true, hasTracking: true, pending: false });
  });

  it('derives dashboard data through the real hook and starts the next workout', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Hello John')).toBeTruthy();
    fireEvent.press(getByText('Next Push'));
    expect(mockNavigate).toHaveBeenCalledWith('WorkoutSession', expect.objectContaining({ workoutSplit: expect.objectContaining({ id: 1 }) }));
  });

  it('derives the empty-plan state and opens the editor', () => {
    Object.assign(mockFeatureState, { hasPlan: false, hasTracking: false });
    const { getByText } = render(<Home />);
    fireEvent.press(getByText('Create workout'));
    expect(mockNavigate).toHaveBeenCalledWith('CreateWorkout');
  });
});
