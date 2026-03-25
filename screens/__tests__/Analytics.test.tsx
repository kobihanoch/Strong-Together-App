/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Animated } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import type { GetAnalyticsResponse } from '../../types/api/analytics/responses';
import type { WholeUserWorkoutPlan } from '../../types/dto/workoutPlans.dto';

const mockModalRegistry = new Map<
  string,
  {
    open: ReturnType<typeof jest.fn>;
    close: ReturnType<typeof jest.fn>;
    snapToIndex: ReturnType<typeof jest.fn>;
    lastData: any[];
  }
>();

let mockAnalyticsLogic: {
  data: {
    overview: {
      workoutCount: number;
      splitsCounter: Record<string, number>;
      workoutPlan: WholeUserWorkoutPlan | null;
    };
    _1rms: {
      rm: GetAnalyticsResponse['_1RM'];
    };
    adherence: {
      adh: GetAnalyticsResponse['goals'];
    };
  };
  hasData: boolean;
  loading: boolean;
};

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
  const { View: ViewLocal } = require('react-native');
  return {
    PieChart: ({ centerLabelComponent }: any) => ReactLocal.createElement(ViewLocal, null, centerLabelComponent?.()),
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { ScrollView: ScrollViewLocal } = require('react-native');
  return {
    ScrollView: ScrollViewLocal,
  };
});

jest.mock('../../components/PageDots', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return ({ index = 0, length = 0 }: { index?: number; length?: number }) =>
    ReactLocal.createElement(TextLocal, null, `Dots ${index}/${length}`);
});

jest.mock('../../hooks/logic/useAnalysticsLogic', () => ({
  __esModule: true,
  default: () => mockAnalyticsLogic,
}));

jest.mock('../../components/SlidingBottomModal', () => {
  const ReactLocal = require('react');
  const { View: ViewLocal, Text: TextLocal } = require('react-native');
  return {
    __esModule: true,
    default: ReactLocal.forwardRef(({ title = 'Items', data = [], renderItem, flatListUsage }: any, ref: any) => {
      let record = mockModalRegistry.get(title);
      if (!record) {
        record = {
          open: jest.fn(),
          close: jest.fn(),
          snapToIndex: jest.fn(),
          lastData: [],
        };
        mockModalRegistry.set(title, record);
      }

      record.lastData = data;

      ReactLocal.useImperativeHandle(ref, () => ({
        open: record.open,
        close: record.close,
        snapToIndex: record.snapToIndex,
      }));

      return ReactLocal.createElement(
        ViewLocal,
        null,
        ReactLocal.createElement(TextLocal, null, title),
        ReactLocal.createElement(TextLocal, null, `Modal items: ${data.length}`),
        flatListUsage
          ? data.map((item: any, index: number) =>
              ReactLocal.createElement(ViewLocal, { key: `${title}-${index}` }, renderItem?.({ item, index })),
            )
          : null,
      );
    }),
  };
});

import Analytics from '../Analytics';

const createWorkoutPlan = (overrides: Partial<WholeUserWorkoutPlan> = {}): WholeUserWorkoutPlan => ({
  id: 7,
  name: 'Performance',
  numberofsplits: 2,
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

const createLogicState = () => ({
  data: {
    overview: {
      workoutCount: 9,
      splitsCounter: { Push: 5, Legs: 4 },
      workoutPlan: createWorkoutPlan(),
    },
    _1rms: {
      rm: {
        1: {
          exercise: 'Bench Press',
          pr_weight: 100,
          pr_reps: 8,
          max_1rm: 126,
        },
        2: {
          exercise: 'Squat',
          pr_weight: 140,
          pr_reps: 5,
          max_1rm: 157,
        },
      },
    },
    adherence: {
      adh: {
        Push: {
          'Bench Press': {
            planned: 12,
            actual: 11,
            adherence_pct: 92,
          },
          'Incline Press': {
            planned: 10,
            actual: 8,
            adherence_pct: 80,
          },
        },
        Legs: {
          Squat: {
            planned: 12,
            actual: 10,
            adherence_pct: 83,
          },
        },
      },
    },
  },
  hasData: true,
  loading: false,
});

describe('Analytics screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockModalRegistry.clear();
    jest.spyOn(Animated, 'timing').mockImplementation(((value: Animated.Value, config: { toValue: number }) => ({
      start: (callback?: (result: { finished: boolean }) => void) => {
        value.setValue(config.toValue);
        callback?.({ finished: true });
      },
      stop: jest.fn(),
      reset: jest.fn(),
    })) as any);
    mockAnalyticsLogic = createLogicState();
  });

  it('renders the analytics sections and wires modal data from the real hook shape', () => {
    const { getAllByText, getByText } = render(<Analytics />);

    expect(getByText('Overview')).toBeTruthy();
    expect(getAllByText('Goal Adherence').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Estimated PRs')).toBeTruthy();
    expect(getByText('All Estimated 1RMs')).toBeTruthy();
    expect(getByText('Modal items: 2')).toBeTruthy();
    expect(getAllByText('Bench Press').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Squat').length).toBeGreaterThanOrEqual(1);

    expect(mockModalRegistry.get('All Estimated 1RMs')?.lastData).toEqual(
      Object.entries(mockAnalyticsLogic.data._1rms.rm),
    );
    expect(mockModalRegistry.get('Goal Adherence')?.lastData).toEqual([]);
  });

  it('opens the goal adherence modal with only the selected split and closes the PR modal first', () => {
    const { getAllByText } = render(<Analytics />);

    fireEvent.press(getAllByText('See all')[0]);

    expect(mockModalRegistry.get('All Estimated 1RMs')?.close).toHaveBeenCalledTimes(1);
    expect(mockModalRegistry.get('Goal Adherence')?.open).toHaveBeenCalledWith(1);
    expect(mockModalRegistry.get('Goal Adherence')?.lastData).toEqual([
      ['Push', mockAnalyticsLogic.data.adherence.adh.Push],
    ]);
  });

  it('renders the screen safely when analytics exists as empty objects but hasData is false', () => {
    mockAnalyticsLogic = {
      data: {
        overview: {
          workoutCount: 0,
          splitsCounter: {},
          workoutPlan: null,
        },
        _1rms: {
          rm: {},
        },
        adherence: {
          adh: {},
        },
      },
      hasData: false,
      loading: false,
    };

    const { getAllByText } = render(<Analytics />);

    expect(getAllByText('No data')).toHaveLength(3);
    expect(mockModalRegistry.get('All Estimated 1RMs')?.lastData).toEqual([]);
    expect(mockModalRegistry.get('Goal Adherence')?.lastData).toEqual([]);
  });
});
