/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-native';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import useHomePageLogic from '../use-home-page-logic.hook';

const mockNavigate = jest.fn();
let mockAuth: any;
let mockMessages: any;
let mockCardio: any;
let mockWorkoutPlan: any;
let mockDashboard: any;
let mockAppLoading = false;

jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockNavigate }) }));
jest.mock('../../../../shared/providers/AppThemeProvider', () => ({
  useAppTheme: () => ({
    colors: {
      canvas: '#fff', surface: '#fff', surfaceMuted: '#eee', border: '#ddd', textPrimary: '#111',
      textSecondary: '#666', primary: '#2977ff', primarySoft: '#eef', achievement: '#f90',
      achievementSoft: '#fff5e5', heroSurface: '#111', heroOverlay: 'rgba(0,0,0,.5)', white: '#fff', profit: '#080',
    },
  }),
}));
jest.mock('../../../../shared/providers/GlobalAppLoadingProvider', () => ({
  useGlobalAppLoadingContext: () => ({ isLoading: mockAppLoading }),
}));
jest.mock('../../../auth/shared/providers/AuthProvider', () => ({ useAuth: () => mockAuth }));
jest.mock('../../../messages/providers/MessagesProvider', () => ({ useMessages: () => mockMessages }));
jest.mock('../../../workouts/cardio/hooks/use-aerobics.hook', () => ({ __esModule: true, default: () => mockCardio }));
jest.mock('../../../workouts/plan/hooks/use-workout-plan.hook', () => ({ __esModule: true, default: () => mockWorkoutPlan }));
jest.mock('../use-home-page-cache-handler.hook', () => ({ __esModule: true, default: () => mockDashboard }));

const splitA = {
  id: 11, workoutId: 7, name: 'A', orderIndex: 0, createdAt: '2026-03-20T08:00:00.000Z',
  muscleGroup: 'Chest', isActive: true,
  exercises: [{ sets: [{ orderIndex: 0, reps: 10 }, { orderIndex: 1, reps: 8 }] }],
};
const splitB = {
  ...splitA, id: 12, name: 'B', orderIndex: 1, muscleGroup: 'Back',
  exercises: [{ sets: [{ orderIndex: 0, reps: 12 }] }],
};
const stats = {
  workoutCount: 3,
  hasExerciseTracking: true,
  nextWorkoutSplit: { id: 12, name: 'B', orderIndex: 1, muscleGroup: 'Back' },
  workoutTargets: { workoutCountThisWeek: 2, workoutCountScheduledPerWeek: 3, weekStreak: 4 },
  lastWorkoutStats: {
    workoutDate: '2026-03-27', workoutSplitName: 'A', exerciseTrackedCount: 5, setTrackedCount: 14,
  },
  prs: [{
    exerciseToSplitId: 20, exerciseId: 1, exerciseName: 'Bench Press', prWeight: 85,
    prReps: 8, prSetIndex: 1, estimatedOneRepMax: 107.7,
  }],
};

describe('useHomePageLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAppLoading = false;
    mockAuth = {
      user: { name: 'John Doe', username: 'johnny', profilePicPath: null, gender: 'Male' },
      isValidatedWithServer: true,
    };
    mockMessages = { unreadMessages: [{ id: 1 }] };
    mockCardio = { weeklyCardioMap: null };
    mockWorkoutPlan = { workoutPlan: { id: 7, workoutSplits: [splitA, splitB] }, workoutSplits: [splitA, splitB] };
    mockDashboard = { dashboardStats: stats, loading: false };
  });

  it('maps dashboard stats and nested plan data into Home data', () => {
    const { result } = renderHook(() => useHomePageLogic());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data.nextWorkout).toMatchObject({
      id: 12, name: 'B', muscleGroup: 'Back', exerciseCount: 1, setCount: 1,
    });
    expect(result.current.data.gymActivity).toEqual({ completedThisWeek: 2, weeklyTarget: 3, weekStreak: 4 });
    expect(result.current.data.lastWorkout).toMatchObject({ name: 'A', exerciseCount: 5, setCount: 14 });
    expect(result.current.data.achievement).toEqual({
      exercise: 'Bench Press', value: '85 kg PR', estimatedOneRepMax: 107.7,
    });
  });

  it('stays loading until dashboard stats are known', () => {
    mockDashboard = { dashboardStats: undefined, loading: false };
    const { result } = renderHook(() => useHomePageLogic());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns the no-workout state when the plan is empty', () => {
    mockWorkoutPlan = { workoutPlan: null, workoutSplits: [] };
    mockDashboard = {
      dashboardStats: { ...stats, hasExerciseTracking: false, nextWorkoutSplit: null },
      loading: false,
    };
    const { result } = renderHook(() => useHomePageLogic());

    expect(result.current.data.state).toEqual({ hasWorkout: false, hasTracking: false });
    expect(result.current.data.nextWorkout.exerciseCount).toBe(0);
  });

  it('uses the latest cardio week and orders bars Monday through Sunday', () => {
    mockCardio = {
      weeklyCardioMap: {
        '2026-03-16': { totalDurationMins: 10, records: [] },
        '2026-03-23': {
          totalDurationMins: 25,
          records: [{ durationMins: 25, workoutTimeUtc: '2026-03-23T10:00:00.000Z' }],
        },
      },
    };
    const { result } = renderHook(() => useHomePageLogic());

    expect(result.current.data.aerobics.totalMinutes).toBe(25);
    expect(result.current.data.aerobics.days[0]).toEqual({ label: 'M', minutes: 25 });
  });

  it('routes Home actions and passes the selected full split', () => {
    const { result } = renderHook(() => useHomePageLogic());
    act(() => {
      result.current.actions.openInbox();
      result.current.actions.createWorkout();
      result.current.actions.startWorkout();
      result.current.actions.openProgress();
      result.current.actions.openHistory();
    });

    expect(mockNavigate).toHaveBeenNthCalledWith(1, 'Inbox');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, 'CreateWorkout');
    expect(mockNavigate).toHaveBeenNthCalledWith(3, 'StartWorkout', { workoutSplit: splitB });
    expect(mockNavigate).toHaveBeenNthCalledWith(4, 'Analytics');
    expect(mockNavigate).toHaveBeenNthCalledWith(5, 'Statistics');
  });
});
