/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Animated, FlatList } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import type {
  AdherenceExerciseStats,
  GoalAdherenceResponse,
  WorkoutRMRecord,
  WorkoutRMsResponse,
} from '../../../types/dto/analytics.dto';
import type { WholeUserWorkoutPlan } from '../../../types/dto/workoutPlans.dto';

jest.mock('@expo/vector-icons', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return {
    FontAwesome5: ({ name }: { name: string }) => ReactLocal.createElement(TextLocal, null, name),
  };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return ({ name }: { name: string }) => ReactLocal.createElement(TextLocal, null, name);
});

jest.mock('expo-linear-gradient', () => {
  const ReactLocal = require('react');
  const { View: ViewLocal } = require('react-native');
  return {
    LinearGradient: ({ children }: any) => ReactLocal.createElement(ViewLocal, null, children),
  };
});

jest.mock('react-native-gifted-charts', () => {
  const ReactLocal = require('react');
  const { View: ViewLocal, Text: TextLocal } = require('react-native');
  return {
    PieChart: ({ data, centerLabelComponent }: any) =>
      ReactLocal.createElement(
        ViewLocal,
        null,
        ReactLocal.createElement(TextLocal, null, `PieChart slices: ${data.length}`),
        centerLabelComponent?.(),
      ),
  };
});

jest.mock('../../PageDots', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return ({ index = 0, length = 0 }: { index?: number; length?: number }) =>
    ReactLocal.createElement(TextLocal, null, `Dots ${index}/${length}`);
});

import Overview from '../Overview';
import GoalAdherence from '../GoalAdherence';
import RenderGoalAdherenceItem from '../RenderGoalAdherenceItem';
import Estimated1RM from '../Estimated1RM';
import RenderEst1RMItem from '../RenderEst1RMItem';
import { AdherenceBar } from '../../AdherenceBar';

const createWorkoutPlan = (overrides: Partial<WholeUserWorkoutPlan> = {}): WholeUserWorkoutPlan => ({
  id: 3,
  name: 'Summer Shred',
  numberofsplits: 3,
  created_at: '2026-03-01T08:00:00.000Z',
  is_deleted: false,
  level: 'Intermediate',
  user_id: 'user-1',
  trainer_id: 'trainer-1',
  is_active: true,
  updated_at: '2026-03-26T08:00:00.000Z',
  workoutsplits: [],
  ...overrides,
});

const createRMRecord = (overrides: Partial<WorkoutRMRecord> = {}): WorkoutRMRecord => ({
  exercise: 'Bench Press',
  pr_weight: 100,
  pr_reps: 8,
  max_1rm: 126,
  ...overrides,
});

const createRMResponse = (): WorkoutRMsResponse => ({
  1: createRMRecord({ exercise: 'Bench Press', pr_weight: 100, pr_reps: 8, max_1rm: 126 }),
  2: createRMRecord({ exercise: 'Squat', pr_weight: 140, pr_reps: 5, max_1rm: 157 }),
  3: createRMRecord({ exercise: 'Deadlift', pr_weight: 180, pr_reps: 3, max_1rm: 198 }),
  4: createRMRecord({ exercise: 'Overhead Press', pr_weight: 60, pr_reps: 6, max_1rm: 72 }),
  5: createRMRecord({ exercise: 'Barbell Row', pr_weight: 90, pr_reps: 10, max_1rm: 120 }),
});

const createAdherenceStats = (overrides: Partial<AdherenceExerciseStats> = {}): AdherenceExerciseStats => ({
  planned: 12,
  actual: 10,
  adherence_pct: 83,
  ...overrides,
});

const createGoalAdherenceResponse = (): GoalAdherenceResponse => ({
  Push: {
    'Bench Press': createAdherenceStats({ planned: 12, actual: 12, adherence_pct: 100 }),
    'Incline Press': createAdherenceStats({ planned: 10, actual: 8, adherence_pct: 80 }),
    'Shoulder Press': createAdherenceStats({ planned: 9, actual: 6, adherence_pct: 67 }),
    'Cable Fly': createAdherenceStats({ planned: 15, actual: 10, adherence_pct: 67 }),
    'Triceps Pushdown': createAdherenceStats({ planned: 15, actual: 15, adherence_pct: 100 }),
  },
  Legs: {
    Squat: createAdherenceStats({ planned: 12, actual: 11, adherence_pct: 92 }),
  },
});

describe('Analytics components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Animated, 'timing').mockImplementation(((value: Animated.Value, config: { toValue: number }) => ({
      start: (callback?: (result: { finished: boolean }) => void) => {
        value.setValue(config.toValue);
        callback?.({ finished: true });
      },
      stop: jest.fn(),
      reset: jest.fn(),
    })) as any);
  });

  describe('Overview', () => {
    it('renders workout overview details when tracking data and workout plan exist', () => {
      const { getByText } = render(
        <Overview
          hasData={true}
          overViewData={{
            workoutCount: 6,
            splitsCounter: { Push: 4, Legs: 2 },
            workoutPlan: createWorkoutPlan(),
          }}
        />,
      );

      expect(getByText('Overview')).toBeTruthy();
      expect(getByText('Workout performances')).toBeTruthy();
      expect(getByText('PieChart slices: 2')).toBeTruthy();
      expect(getByText('6')).toBeTruthy();
      expect(getByText('Total workouts')).toBeTruthy();
      expect(getByText('Push: 4')).toBeTruthy();
      expect(getByText('Legs: 2')).toBeTruthy();
      expect(getByText('Summer Shred')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('26/03/2026')).toBeTruthy();
    });

    it('renders the fallback branch when tracking exists but workout plan is missing', () => {
      const { getByText, queryByText } = render(
        <Overview
          hasData={true}
          overViewData={{
            workoutCount: 6,
            splitsCounter: { Push: 4 },
            workoutPlan: null,
          }}
        />,
      );

      expect(getByText('No data')).toBeTruthy();
      expect(queryByText('Total workouts')).toBeNull();
    });

    it('renders safely when tracking exists but the split counters are empty and workout count is zero', () => {
      const { getByText, queryByText } = render(
        <Overview
          hasData={true}
          overViewData={{
            workoutCount: 0,
            splitsCounter: {},
            workoutPlan: createWorkoutPlan({ name: 'Rebuild', numberofsplits: 0 }),
          }}
        />,
      );

      expect(getByText('PieChart slices: 0')).toBeTruthy();
      expect(getByText('Total workouts')).toBeTruthy();
      expect(getByText('Rebuild')).toBeTruthy();
      expect(queryByText('Push: 4')).toBeNull();
    });
  });

  describe('GoalAdherence', () => {
    it('renders the empty state when tracking data is not available yet', () => {
      const { getByText } = render(
        <GoalAdherence adherenceData={{ adh: createGoalAdherenceResponse() }} hasData={false} onSeeAll={jest.fn()} />,
      );

      expect(getByText('No data')).toBeTruthy();
    });

    it('renders the empty state when hasData is true but the adherence response is empty', () => {
      const { getByText, queryByText } = render(
        <GoalAdherence adherenceData={{ adh: {} }} hasData={true} onSeeAll={jest.fn()} />,
      );

      expect(getByText('No data')).toBeTruthy();
      expect(queryByText('Dots 0/0')).toBeNull();
    });

    it('renders paged split cards, limits the preview to four exercises, and updates the current page', () => {
      const onSeeAll = jest.fn();
      const adherence = createGoalAdherenceResponse();
      const { getByText, getAllByText, queryByText, UNSAFE_getByType } = render(
        <GoalAdherence adherenceData={{ adh: adherence }} hasData={true} onSeeAll={onSeeAll} />,
      );

      expect(getByText('Dots 0/2')).toBeTruthy();
      expect(getByText('Push')).toBeTruthy();
      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Incline Press')).toBeTruthy();
      expect(getByText('Shoulder Press')).toBeTruthy();
      expect(getByText('Cable Fly')).toBeTruthy();
      expect(queryByText('Triceps Pushdown')).toBeNull();

      const flatList = UNSAFE_getByType(FlatList);
      fireEvent(flatList, 'layout', { nativeEvent: { layout: { width: 320 } } });
      fireEvent(flatList, 'momentumScrollEnd', { nativeEvent: { contentOffset: { x: 320 } } });

      expect(getByText('Dots 1/2')).toBeTruthy();

      fireEvent.press(getAllByText('See all')[0]);

      expect(onSeeAll).toHaveBeenCalledWith('Push', adherence.Push);
    });
  });

  describe('RenderGoalAdherenceItem', () => {
    it('renders only the requested number of exercises and sends the full selected split on See all', () => {
      const onSeeAll = jest.fn();
      const split = createGoalAdherenceResponse().Push;
      const { getByText, queryByText } = render(
        <RenderGoalAdherenceItem name="Push" v={split} showSeeAll={true} limit={2} onSeeAll={onSeeAll} />,
      );

      expect(getByText('Push')).toBeTruthy();
      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Incline Press')).toBeTruthy();
      expect(queryByText('Shoulder Press')).toBeNull();

      fireEvent.press(getByText('See all'));

      expect(onSeeAll).toHaveBeenCalledWith('Push', split);
    });

    it('renders safely when the split has no exercises and the button is disabled by props', () => {
      const { getByText, queryByText } = render(<RenderGoalAdherenceItem name="Recovery" v={{}} showSeeAll={false} />);

      expect(getByText('Recovery')).toBeTruthy();
      expect(queryByText('See all')).toBeNull();
      expect(queryByText('Bench Press')).toBeNull();
    });
  });

  describe('Estimated1RM', () => {
    it('renders the first four PR records and opens the full list via the footer button', () => {
      const onSeeAll = jest.fn();
      const { getByText, queryByText } = render(
        <Estimated1RM rmData={{ rm: createRMResponse() }} hasData={true} onSeeAll={onSeeAll} />,
      );

      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Squat')).toBeTruthy();
      expect(getByText('Deadlift')).toBeTruthy();
      expect(getByText('Overhead Press')).toBeTruthy();
      expect(queryByText('Barbell Row')).toBeNull();

      fireEvent.press(getByText('See all'));

      expect(onSeeAll).toHaveBeenCalledTimes(1);
    });

    it('renders the fallback when tracking has not been unpacked yet', () => {
      const { getByText, queryByText } = render(
        <Estimated1RM rmData={{ rm: createRMResponse() }} hasData={false} onSeeAll={jest.fn()} />,
      );

      expect(getByText('No data')).toBeTruthy();
      expect(queryByText('See all')).toBeNull();
    });

    it('keeps the footer action visible when tracking exists but the PR map is empty', () => {
      const onSeeAll = jest.fn();
      const { getByText, queryByText } = render(
        <Estimated1RM rmData={{ rm: {} }} hasData={true} onSeeAll={onSeeAll} />,
      );

      expect(queryByText('No data')).toBeNull();
      expect(getByText('See all')).toBeTruthy();

      fireEvent.press(getByText('See all'));

      expect(onSeeAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('RenderEst1RMItem', () => {
    it('renders PR text even when weight and reps are null and the estimated max is zero', () => {
      const { getByText } = render(
        <RenderEst1RMItem
          k={99}
          v={createRMRecord({ exercise: 'Lat Pulldown', pr_weight: null, pr_reps: null, max_1rm: 0 })}
        />,
      );

      expect(getByText('Lat Pulldown')).toBeTruthy();
      expect(getByText(' x ')).toBeTruthy();
      expect(getByText('0 kg')).toBeTruthy();
      expect(getByText('Est. 1RM')).toBeTruthy();
    });
  });

  describe('AdherenceBar', () => {
    it('falls back to zero percent when planned reps are zero', () => {
      const { getByText } = render(<AdherenceBar actual={20} planned={0} />);

      expect(getByText('0%')).toBeTruthy();
    });

    it('clamps explicit percent overrides above one hundred', () => {
      const { getByText } = render(<AdherenceBar actual={1} planned={1} pct={135} />);

      expect(getByText('100%')).toBeTruthy();
    });

    it('clamps explicit percent overrides below zero', () => {
      const { getByText } = render(<AdherenceBar actual={5} planned={10} pct={-10} />);

      expect(getByText('0%')).toBeTruthy();
    });

    it('hides the percent label when showPct is false', () => {
      const { queryByText } = render(<AdherenceBar actual={5} planned={10} showPct={false} />);

      expect(queryByText('50%')).toBeNull();
    });
  });
});
