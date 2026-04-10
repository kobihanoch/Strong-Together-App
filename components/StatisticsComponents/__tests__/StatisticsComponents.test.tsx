/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react-native';
import moment from 'moment-timezone';
import React from 'react';
import type { AerobicsDailyRecord, AerobicsWeeklyRecord, WeeklyData } from '@strong-together/shared';
import type { TrackingMapItem } from '@strong-together/shared';

const mockNavigate = jest.fn();
const mockScrollToIndex = jest.fn();
const mockUseGenerateDays = jest.fn();
const mockBarChart = jest.fn((...args: unknown[]) => null);

jest.mock('@expo/vector-icons', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal } = require('react-native');
  return {
    MaterialCommunityIcons: ({ name }: { name: string }) => ReactLocal.createElement(TextLocal, null, name),
  };
});

jest.mock('expo-image', () => {
  const ReactLocal = require('react');
  const { View: ViewLocal } = require('react-native');
  return {
    Image: (props: any) => ReactLocal.createElement(ViewLocal, props),
  };
});

jest.mock('expo-linear-gradient', () => {
  const ReactLocal = require('react');
  const { View: ViewLocal } = require('react-native');
  return {
    LinearGradient: ({ children }: any) => ReactLocal.createElement(ViewLocal, null, children),
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@animatereactnative/accordion', () => {
  const ReactLocal = require('react');
  const { View: ViewLocal } = require('react-native');
  const Header = ({ children }: any) => ReactLocal.createElement(ViewLocal, null, children);
  const Expanded = ({ children }: any) => ReactLocal.createElement(ViewLocal, null, children);
  const HeaderIcon = ({ children }: any) => ReactLocal.createElement(ViewLocal, null, children);
  const Accordion = ({ children }: any) => ReactLocal.createElement(ViewLocal, null, children);
  Accordion.Header = Header;
  Accordion.Expanded = Expanded;
  Accordion.HeaderIcon = HeaderIcon;
  return { Accordion: { Accordion, Header, Expanded, HeaderIcon } };
});

jest.mock('react-native-gifted-charts', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal, View: ViewLocal } = require('react-native');
  return {
    BarChart: (props: any) => {
      mockBarChart(props);
      return ReactLocal.createElement(
        ViewLocal,
        null,
        ReactLocal.createElement(TextLocal, null, `Bars ${props.data.length}`),
      );
    },
  };
});

jest.mock('react-native-segmented-control-2', () => {
  const ReactLocal = require('react');
  const { Text: TextLocal, TouchableOpacity: TouchableOpacityLocal, View: ViewLocal } = require('react-native');

  return ({ tabs, onChange, value }: { tabs: React.ReactNode[]; onChange: (index: number) => void; value: number }) =>
    ReactLocal.createElement(
      ViewLocal,
      null,
      tabs.map((tab, index) =>
        ReactLocal.createElement(
          TouchableOpacityLocal,
          {
            key: `tab-${index}`,
            onPress: () => onChange(index),
            accessibilityRole: 'button',
          },
          ReactLocal.createElement(TextLocal, null, value === index ? `selected-${index}` : `tab-${index}`),
          tab,
        ),
      ),
    );
});

jest.mock('../../../hooks/useGenerateDays', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseGenerateDays(...args),
}));

jest.mock('../../../components/Images', () => ({
  Chest: {
    Upper: 1,
  },
}));

import CalendarStripCustom from '../CalenderStripCustom';
import CardioSection from '../CardioSection';
import CardioWeeklyGraph from '../CardioWeeklyGraph';
import ExercisesFlatList from '../ExercisesFlatList';
import RestDayCard from '../RestDayCard';
import StatsTable from '../StatsTable';
import TabSelect, { TabSelectHandleRef } from '../TabSelect';
import WorkoutHeader from '../WorkoutHeader';

const createTrackingItem = (overrides: Partial<TrackingMapItem> = {}): TrackingMapItem => ({
  id: 1,
  exercisetosplit_id: 10,
  exercise_id: 15,
  workoutsplit_id: 3,
  splitname: 'Push',
  exercise: 'Bench Press',
  workoutdate: '2026-03-26',
  order_index: 1,
  weight: [100, 90],
  reps: [8, 10],
  notes: 'Drive through the chest.',
  exercisetoworkoutsplit: {
    sets: [8, 10],
    exercises: {
      targetmuscle: 'Chest',
      specifictargetmuscle: 'Upper',
    },
  },
  ...overrides,
});

const createDailyCardio = (overrides: Partial<AerobicsDailyRecord> = {}): AerobicsDailyRecord => ({
  duration_mins: 25,
  duration_sec: 30,
  type: 'Run',
  ...overrides,
});

const createWeeklyRecord = (overrides: Partial<AerobicsWeeklyRecord> = {}): AerobicsWeeklyRecord => ({
  duration_mins: 20,
  duration_sec: 0,
  type: 'Run',
  workout_time_utc: '2026-03-23',
  ...overrides,
});

const createWeeklyData = (overrides: Partial<WeeklyData> = {}): WeeklyData => ({
  records: [createWeeklyRecord(), createWeeklyRecord({ workout_time_utc: '2026-03-25', duration_mins: 35 })],
  total_duration_mins: 55,
  total_duration_sec: 3300,
  ...overrides,
});

describe('Statistics components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    mockUseGenerateDays.mockReturnValue({
      datesList: [
        moment.tz('2026-03-25', 'YYYY-MM-DD', timezone),
        moment.tz('2026-03-26', 'YYYY-MM-DD', timezone),
        moment.tz('2026-03-27', 'YYYY-MM-DD', timezone),
      ],
    });
    mockScrollToIndex.mockReset();
  });

  describe('CalendarStripCustom', () => {
    it('renders workout split labels and notifies when a date is pressed', () => {
      const onDateSelect = jest.fn();
      const logs = {
        '2026-03-26': [createTrackingItem({ splitname: 'Push', workoutdate: '2026-03-26' })],
      };

      const { getByText } = render(
        <CalendarStripCustom onDateSelect={onDateSelect} selectedDate="2026-03-26" userExerciseLogs={logs} />,
      );

      expect(getByText('March 2026')).toBeTruthy();
      expect(getByText('Push')).toBeTruthy();

      fireEvent.press(getByText('27'));

      expect(onDateSelect).toHaveBeenCalledWith('2026-03-27');
    });

    it('renders Rest for dates without logs and the Today action scrolls back to today', () => {
      const onDateSelect = jest.fn();
      const today = moment.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('YYYY-MM-DD');
      mockUseGenerateDays.mockReturnValue({
        datesList: [moment.tz(today, 'YYYY-MM-DD', Intl.DateTimeFormat().resolvedOptions().timeZone)],
      });

      const { getByText } = render(
        <CalendarStripCustom onDateSelect={onDateSelect} selectedDate="2026-03-26" userExerciseLogs={null} />,
      );

      expect(getByText('Rest')).toBeTruthy();

      fireEvent.press(getByText('Today'));

      expect(onDateSelect).toHaveBeenCalledWith(today);
    });
  });

  describe('TabSelect', () => {
    it('switches tabs through the segmented control and toggles the cardio dot via ref methods', () => {
      const setIndex = jest.fn();
      const ref = React.createRef<TabSelectHandleRef>();
      const { getByText, queryAllByText, rerender } = render(<TabSelect index={0} setIndex={setIndex} ref={ref} />);

      expect(getByText('Exercises')).toBeTruthy();
      expect(getByText('Cardio')).toBeTruthy();

      fireEvent.press(getByText('tab-1'));
      expect(setIndex).toHaveBeenCalledWith(1);

      expect(queryAllByText('selected-1')).toHaveLength(0);

      act(() => {
        ref.current?.showCardioDot();
      });
      rerender(<TabSelect index={1} setIndex={setIndex} ref={ref} />);

      expect(getByText('selected-1')).toBeTruthy();

      act(() => {
        ref.current?.hideCardioDot();
      });
      rerender(<TabSelect index={1} setIndex={setIndex} ref={ref} />);

      expect(getByText('Cardio')).toBeTruthy();
    });
  });

  describe('WorkoutHeader', () => {
    it('renders workout metadata when the selected day has logs', () => {
      const { getByText } = render(
        <WorkoutHeader data={[createTrackingItem({ splitname: 'Pull' })]} selectedDate="2026-03-26" />,
      );

      expect(getByText('Pull')).toBeTruthy();
      expect(getByText('Workout Pull')).toBeTruthy();
      expect(getByText('Mar 26, 2026')).toBeTruthy();
    });

    it('renders the rest-day fallback when data is undefined or an empty array', () => {
      const undefinedState = render(<WorkoutHeader data={undefined} selectedDate="2026-03-26" />);
      expect(undefinedState.getByText('Rest day')).toBeTruthy();

      const emptyArrayState = render(<WorkoutHeader data={[]} selectedDate="2026-03-26" />);
      expect(emptyArrayState.getByText('Rest day')).toBeTruthy();
      expect(emptyArrayState.getByText('R')).toBeTruthy();
    });
  });

  describe('StatsTable', () => {
    it('renders rows and only shows delta pills for non-zero numeric deltas', () => {
      const { getByText, queryByText } = render(
        <StatsTable
          rows={[
            { setNo: 1, reps: 8, repsDelta: 2, weight: 100, weightDelta: -5 },
            { setNo: 2, reps: 10, repsDelta: 0, weight: 90, weightDelta: Number.NaN },
          ]}
        />,
      );

      expect(getByText('#1')).toBeTruthy();
      expect(getByText('+ 2')).toBeTruthy();
      expect(getByText('- 5')).toBeTruthy();
      expect(getByText('100 kg')).toBeTruthy();
      expect(queryByText('+ 0')).toBeNull();
    });
  });

  describe('ExercisesFlatList', () => {
    it('renders exercise details, previous workout deltas, and notes for workout data', () => {
      const current = createTrackingItem();
      const previous = {
        ...createTrackingItem({
          id: 2,
          workoutdate: '2026-03-20',
          weight: [95, 85],
          reps: [7, 10],
        }),
        isLastWorkout: true,
      };

      const { getAllByText, getByText } = render(<ExercisesFlatList data={[current]} dataToCompare={[previous]} />);

      expect(getByText('Bench Press')).toBeTruthy();
      expect(getByText('Tap to toggle information')).toBeTruthy();
      expect(getByText('+ 1')).toBeTruthy();
      expect(getAllByText('+ 5').length).toBeGreaterThanOrEqual(1);
      expect(getByText('Notes:')).toBeTruthy();
      expect(getByText('Drive through the chest.')).toBeTruthy();
    });

    it('renders the rest-day card when data is undefined or an empty array and navigates to MyWorkoutPlan', () => {
      const undefinedState = render(<ExercisesFlatList data={undefined} dataToCompare={[]} />);
      expect(undefinedState.getByText('Rest Day')).toBeTruthy();

      const emptyState = render(<ExercisesFlatList data={[]} dataToCompare={[]} />);
      fireEvent.press(emptyState.getByText('Plan next workout'));

      expect(mockNavigate).toHaveBeenCalledWith('MyWorkoutPlan');
    });
  });

  describe('RestDayCard', () => {
    it('invokes the plan CTA callback', () => {
      const onPlanPress = jest.fn();
      const { getByText } = render(<RestDayCard onPlanPress={onPlanPress} />);

      fireEvent.press(getByText('Plan next workout'));

      expect(onPlanPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('CardioSection', () => {
    it('renders daily and weekly cardio data when available', () => {
      const { getByText, getByTestId } = render(
        <CardioSection daily={[createDailyCardio()]} weekly={createWeeklyData()} />,
      );

      fireEvent(getByTestId('weekly-card'), 'layout', { nativeEvent: { layout: { width: 320 } } });

      expect(getByText('25 mins 30 secs')).toBeTruthy();
      expect(getByText('Run')).toBeTruthy();
      expect(getByText('Total: 55 mins')).toBeTruthy();
      expect(getByText('Bars 7')).toBeTruthy();
    });

    it('renders None and the fallback weekly empty state for missing cardio data', () => {
      const { getAllByText, getByText } = render(<CardioSection daily={undefined} weekly={undefined} />);

      expect(getAllByText('None')).toHaveLength(2);
      expect(getByText('No cardio assigned')).toBeTruthy();
      expect(getByText('Log a cardio session to see the weekly chart')).toBeTruthy();
      expect(getByText('Total: 0 mins')).toBeTruthy();
    });

    it('treats a daily zero-minute cardio entry as no recorded cardio for the UI copy', () => {
      const { getAllByText } = render(
        <CardioSection
          daily={[createDailyCardio({ duration_mins: 0, duration_sec: 30, type: 'Bike' })]}
          weekly={undefined}
        />,
      );

      expect(getAllByText('None')).toHaveLength(2);
    });
  });

  describe('CardioWeeklyGraph', () => {
    it('returns null until the card width is measured', () => {
      const { queryByText } = render(<CardioWeeklyGraph data={createWeeklyData().records} cardWidth={0} />);

      expect(queryByText('Bars 7')).toBeNull();
    });

    it('normalizes weekly data into seven bars once width is available', () => {
      const { getByText } = render(<CardioWeeklyGraph data={createWeeklyData().records} cardWidth={320} />);

      expect(getByText('Bars 7')).toBeTruthy();
      expect(mockBarChart).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({ label: 'Sun', value: 0 }),
            expect.objectContaining({ label: 'Mon', value: 20 }),
            expect.objectContaining({ label: 'Wed', value: 35 }),
          ]),
        }),
      );
    });
  });
});
