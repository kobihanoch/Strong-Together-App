import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../../features/dashboard/use-dashboard.hook', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../../features/workouts/history/hooks/use-exercise-history.hook', () => ({ useExerciseHistory: jest.fn() }));
jest.mock('../../../../features/workouts/history/hooks/use-workout-history.hook', () => ({ useWorkoutHistory: jest.fn() }));
jest.mock('../../../../features/workouts/history/hooks/use-pr-history.hook', () => ({ usePrHistory: jest.fn() }));
jest.mock('../../../../features/workouts/plan/hooks/use-workout-plan.hook', () => ({ useWorkoutPlan: jest.fn() }));
jest.mock('../../../../features/workouts/cardio/hooks/use-cardio.hook', () => ({ useCardio: jest.fn() }));

import useTrackHistory from '../use-track-history.hook';

describe('useTrackHistory', () => {
  it('exports the page hook', () => {
    expect(useTrackHistory).toBeDefined();
  });
});
