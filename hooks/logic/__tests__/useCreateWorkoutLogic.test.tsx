/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AddWorkoutResponse } from '../../../types/api/workouts/responses';

const mockNavigate = jest.fn();
const mockSetWorkout = jest.fn();
const mockSetWorkoutForEdit = jest.fn();
const mockDialogShow = jest.fn();
const mockDialogHide = jest.fn();
const mockAddWorkout = jest.fn<(...args: any[]) => Promise<AddWorkoutResponse>>();
const mockUseExercises = jest.fn();
const mockWorkoutContext = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('react-native-alert-notification', () => ({
  ALERT_TYPE: {
    WARNING: 'WARNING',
  },
  Dialog: {
    show: (...args: any[]) => mockDialogShow(...args),
    hide: (...args: any[]) => mockDialogHide(...args),
  },
}));

jest.mock('../../useExercises', () => ({
  __esModule: true,
  default: () => mockUseExercises(),
}));

jest.mock('../../../context/WorkoutContext', () => ({
  useWorkoutContext: () => mockWorkoutContext(),
}));

jest.mock('../../../services/WorkoutService', () => ({
  addWorkout: (...args: any[]) => mockAddWorkout(...args),
}));

import useCreateWorkoutLogic from '../useCreateWorkoutLogic';

const createWorkoutPlanForEdit = () => ({
  A: [{ id: 1, name: 'Bench Press', sets: [10, 10, 10], order_index: 0 }],
  B: [{ id: 2, name: 'Barbell Row', sets: [12, 12, 12], order_index: 0 }],
});

const createAddWorkoutResponse = (): AddWorkoutResponse =>
  ({
    message: 'Workout saved successfully',
    workoutPlan: { id: 'workout-1' },
    workoutPlanForEditWorkout: createWorkoutPlanForEdit(),
  }) as unknown as AddWorkoutResponse;

const createDeferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('useCreateWorkoutLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWorkoutContext.mockReturnValue({
      setWorkout: mockSetWorkout,
      setWorkoutForEdit: mockSetWorkoutForEdit,
      workoutForEdit: null,
    });
    mockUseExercises.mockReturnValue({
      exercises: {
        Chest: [{ id: 1, name: 'Bench Press', specificTargetMuscle: 'Upper Chest' }],
      },
      loading: false,
    });
  });

  it('initializes edit mode from workoutForEdit data', async () => {
    mockWorkoutContext.mockReturnValue({
      setWorkout: mockSetWorkout,
      setWorkoutForEdit: mockSetWorkoutForEdit,
      workoutForEdit: createWorkoutPlanForEdit(),
    });

    const { result } = renderHook(() => useCreateWorkoutLogic());

    await waitFor(() => {
      expect(result.current.hasWorkout).toBe(true);
      expect(result.current.splitsList).toEqual(['A', 'B']);
      expect(result.current.exForSplit).toEqual([{ id: 1, name: 'Bench Press', sets: [10, 10, 10], order_index: 0 }]);
    });
  });

  it('shows validation dialog and blocks save when a split is empty', async () => {
    const { result } = renderHook(() => useCreateWorkoutLogic());

    await act(async () => {
      await result.current.saveWorkout();
    });

    expect(mockAddWorkout).not.toHaveBeenCalled();
    expect(mockDialogShow).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Workout is incomplete',
      }),
    );
  });

  it('prevents duplicate save requests while a save is already in flight', async () => {
    const deferred = createDeferred<AddWorkoutResponse>();
    mockAddWorkout.mockReturnValue(deferred.promise);

    const { result } = renderHook(() => useCreateWorkoutLogic());

    await act(async () => {
      result.current.controls.addExercise({ id: 1, name: 'Bench Press' });
    });

    act(() => {
      result.current.saveWorkout();
      result.current.saveWorkout();
    });

    expect(mockAddWorkout).toHaveBeenCalledTimes(1);

    await act(async () => {
      deferred.resolve(createAddWorkoutResponse());
      await deferred.promise;
    });
  });

  it('navigates to MyWorkoutPlan after a successful save', async () => {
    mockAddWorkout.mockResolvedValue(createAddWorkoutResponse());

    const { result } = renderHook(() => useCreateWorkoutLogic());

    await act(async () => {
      result.current.controls.addExercise({ id: 1, name: 'Bench Press' });
    });

    await act(async () => {
      result.current.saveWorkout();
    });

    await waitFor(() => {
      expect(mockSetWorkout).toHaveBeenCalledWith({ id: 'workout-1' });
      expect(mockSetWorkoutForEdit).toHaveBeenCalledWith(createWorkoutPlanForEdit());
      expect(mockNavigate).toHaveBeenCalledWith('MyWorkoutPlan');
    });
  });

  it('resets isSaving after a failed save request', async () => {
    const deferred = createDeferred<AddWorkoutResponse>();
    mockAddWorkout.mockReturnValue(deferred.promise);

    const { result } = renderHook(() => useCreateWorkoutLogic());

    await act(async () => {
      result.current.controls.addExercise({ id: 1, name: 'Bench Press' });
    });

    act(() => {
      result.current.saveWorkout();
    });

    expect(result.current.loadings.isSaving).toBe(true);

    await act(async () => {
      deferred.reject(new Error('save failed'));
      try {
        await deferred.promise;
      } catch {}
    });

    await waitFor(() => {
      expect(result.current.loadings.isSaving).toBe(false);
    });
  });
});
