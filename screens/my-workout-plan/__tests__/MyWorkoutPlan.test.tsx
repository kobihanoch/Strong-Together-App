/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import MyWorkoutPlan from '../MyWorkoutPlan';

const mockNavigate = jest.fn();
const mockPlanState = { hasPlan: true, pending: false };
const mockSplit = { id: 1, name: 'Push Day', orderIndex: 0, muscleGroup: 'Chest', exercises: [{ exerciseToSplitId: 101, exerciseId: 11, name: 'Bench Press', orderIndex: 0, sets: [{ reps: 10 }] }] };

jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockNavigate }) }));
jest.mock('../../../shared/providers/AppThemeProvider', () => ({ useAppTheme: () => ({ colors: { canvas: '#fff' } }) }));
jest.mock('../../../features/workouts/plan/hooks/use-workout-plan.hook', () => ({
  useWorkoutPlan: () => ({ data: { hasWorkoutPlan: mockPlanState.hasPlan, workoutPlan: mockPlanState.hasPlan ? { numberOfSplits: 1 } : null, workoutSplits: mockPlanState.hasPlan ? [mockSplit] : [] }, loadingStates: { isPending: mockPlanState.pending } }),
}));
jest.mock('../../../features/workouts/history/hooks/use-workout-history.hook', () => ({
  useWorkoutHistory: () => ({ data: { workoutHistoryMap: { byDate: {} }, hasTrainedToday: false }, loadingStates: { isPending: false } }),
}));
jest.mock('../../../features/workouts/history/hooks/use-exercise-history.hook', () => ({
  useExerciseHistory: () => ({
    data: { exerciseHistoryMap: {}, hasVisibleHistory: false, getLastPerformanceForExercise: () => null },
    loadingStates: { isPending: false },
  }),
}));
jest.mock('../../../features/dashboard/use-dashboard.hook', () => ({
  __esModule: true,
  default: () => ({ data: { workoutTargets: { workoutCountThisWeek: 1, workoutCountScheduledPerWeek: 3 } }, loadingStates: { isPending: false } }),
}));
jest.mock('../components/WorkoutPlanSkeleton', () => () => null);
jest.mock('../components/NoWorkoutPlan', () => ({ onCreatePress }: any) => {
  const { Text } = require('react-native');
  return <Text onPress={onCreatePress}>Create plan</Text>;
});
jest.mock('../components/WorkoutPlanHeader', () => () => null);
jest.mock('../components/WorkoutPlanSummary', () => ({ split: item, onStart, onEdit }: any) => {
  const { Text, View } = require('react-native');
  return <View><Text>{item.name}</Text><Text onPress={onStart}>Start</Text><Text onPress={onEdit}>Edit</Text></View>;
});
jest.mock('../components/WorkoutSplitSelector', () => () => null);
jest.mock('../components/WorkoutPlanExerciseList', () => ({ split: item, expandedExerciseId, onExerciseExpand }: any) => {
  const { Text } = require('react-native');
  const id = item.exercises[0].exerciseToSplitId;
  return <Text onPress={() => onExerciseExpand(expandedExerciseId === id ? null : id)}>Expanded: {String(expandedExerciseId)}</Text>;
});

describe('MyWorkoutPlan integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockPlanState, { hasPlan: true, pending: false });
  });

  it('uses the real hook for row expansion and navigation', () => {
    const { getByText } = render(<MyWorkoutPlan />);
    fireEvent.press(getByText('Expanded: null'));
    expect(getByText('Expanded: 101')).toBeTruthy();
    fireEvent.press(getByText('Start'));
    fireEvent.press(getByText('Edit'));
    expect(mockNavigate).toHaveBeenCalledWith('WorkoutSession', { workoutSplit: mockSplit });
    expect(mockNavigate).toHaveBeenCalledWith('CreateWorkout');
  });

  it('uses the real hook for the empty-plan action', () => {
    mockPlanState.hasPlan = false;
    const { getByText } = render(<MyWorkoutPlan />);
    fireEvent.press(getByText('Create plan'));
    expect(mockNavigate).toHaveBeenCalledWith('CreateWorkout');
  });
});
