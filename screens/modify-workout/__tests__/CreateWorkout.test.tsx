/* eslint-disable @typescript-eslint/no-require-imports */
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import CreateWorkout from '../CreateWorkout';

const mockNavigate = { goBack: jest.fn(), replace: jest.fn() };
const mockUpdateWorkoutPlan = jest.fn(async () => undefined);
const mockPlanState = { pending: false, workoutPlan: null as any };

jest.mock('@react-navigation/native', () => ({ useNavigation: () => mockNavigate }));
jest.mock('react-native-safe-area-context', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => ReactLocal.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});
jest.mock('../../../shared/providers/AppThemeProvider', () => ({
  useAppTheme: () => ({ mode: 'light', colors: { canvas: '#fff', surface: '#fff', textPrimary: '#111', textSecondary: '#777', border: '#ddd' } }),
}));
jest.mock('../../../features/workouts/plan/hooks/use-workout-plan.hook', () => ({
  useWorkoutPlan: () => ({
    data: { workoutPlan: mockPlanState.workoutPlan },
    loadingStates: { isPending: mockPlanState.pending, isUpdating: false },
    actions: { updateWorkoutPlan: mockUpdateWorkoutPlan },
  }),
}));
jest.mock('../../../features/workouts/plan/hooks/use-exercises.hook', () => ({
  __esModule: true,
  default: () => ({
    data: { Chest: [{ id: 11, name: 'Bench Press', specificTargetMuscle: 'Upper chest' }] },
    loadingStates: { isPending: false },
  }),
}));
jest.mock('../../../shared/components/SlidingBottomModal', () => {
  const ReactLocal = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: ReactLocal.forwardRef(({ children }: any, _ref: any) => <View>{children}</View>) };
});
jest.mock('../components/PlanEditorHeader', () => ({ splits, selectedIndex, onAddSplit, onSelect }: any) => {
  const { Text, View } = require('react-native');
  return (
    <View>
      <Text>Splits: {splits.length}</Text>
      <Text>Selected: {splits[selectedIndex]?.name}</Text>
      <Text onPress={onAddSplit}>Add split</Text>
      {splits.map((split: any, index: number) => <Text key={index} onPress={() => onSelect(index)}>Choose {split.name}</Text>)}
    </View>
  );
});
jest.mock('../components/PlanExerciseList', () => ({ exercises }: any) => {
  const { Text } = require('react-native');
  return <Text>Exercises: {exercises.length}</Text>;
});
jest.mock('../components/PlanEditorActions', () => () => null);
jest.mock('../components/ExerciseLibrarySheet', () => () => null);

describe('CreateWorkout integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlanState.pending = false;
    mockPlanState.workoutPlan = null;
  });

  it('initializes a new plan through the real editor hook and reducer', async () => {
    const { getByText } = render(<CreateWorkout />);
    await waitFor(() => expect(getByText('Selected: Split A')).toBeTruthy());
    expect(getByText('Splits: 1')).toBeTruthy();
  });

  it('adds and selects a split through the real editor hook', async () => {
    const { getByText } = render(<CreateWorkout />);
    await waitFor(() => expect(getByText('Selected: Split A')).toBeTruthy());
    fireEvent.press(getByText('Add split'));
    expect(getByText('Splits: 2')).toBeTruthy();
    expect(getByText('Selected: Split B')).toBeTruthy();
  });

  it('hydrates an existing workout through the real editor hook', async () => {
    mockPlanState.workoutPlan = {
      workoutSplits: [{ id: 4, name: 'Push', orderIndex: 0, exercises: [{ exerciseId: 11, orderIndex: 0, sets: [{ reps: 8 }] }] }],
    };
    const { getByText } = render(<CreateWorkout />);
    await waitFor(() => expect(getByText('Selected: Push')).toBeTruthy());
    expect(getByText('Exercises: 1')).toBeTruthy();
  });
});
