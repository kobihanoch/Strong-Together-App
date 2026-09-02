import { describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../../features/dashboard/use-dashboard.hook', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../../features/workouts/history/hooks/use-exercise-history.hook', () => ({ useExerciseHistory: jest.fn() }));
jest.mock('../../../../features/workouts/history/hooks/use-workout-history.hook', () => ({ useWorkoutHistory: jest.fn() }));

import useTrackHistory from '../use-track-history.hook';

describe('useTrackHistory', () => {
  it('exports the page hook', () => {
    expect(useTrackHistory).toBeDefined();
  });
});
