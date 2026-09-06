import { describe, expect, it } from '@jest/globals';
import { DateTime } from 'luxon';
import { getScheduleWeek } from '../home-page.utils';
import { WorkoutHistoryMap } from '../../../../features/workouts/history/types/workout-history.types';
import { WorkoutSchedulesItem } from '../../../../features/workout-schedule/types/workout-schedule.types';

describe('weekly completed workouts', () => {
  const today = DateTime.now().setZone('UTC');
  const history = {
    byDate: {
      [today.toISODate()!]: {
        durationMins: 35,
        exerciseTracked: [{ exerciseTracking: { exerciseAssignment: { workoutSplitId: 2, workoutSplitName: 'Pull' } } }],
      },
    },
  } as unknown as WorkoutHistoryMap;
  const schedule = (id: number) => [{ dayOfWeek: today.weekday % 7, workoutSplitId: id, startTime: '18:00' }] as WorkoutSchedulesItem[];

  it('includes completed extra workouts when there is no schedule', () => {
    expect(getScheduleWeek([], [], history, 'UTC')).toEqual([expect.objectContaining({ completed: true, isScheduled: false, name: 'Pull' })]);
  });

  it('keeps the scheduled workout pending when an extra workout was completed', () => {
    const rows = getScheduleWeek(schedule(1), [], history, 'UTC');
    expect(rows.map((day) => day.completed)).toEqual([false, true]);
    expect(rows.map((day) => day.isScheduled)).toEqual([true, false]);
  });

  it('does not duplicate a completed scheduled workout', () => {
    const rows = getScheduleWeek(schedule(2), [], history, 'UTC');
    expect(rows).toHaveLength(1);
    expect(rows[0].completed).toBe(true);
    expect(rows[0].startTime).toBe('18:00');
    expect(rows[0].isScheduled).toBe(true);
  });
});
