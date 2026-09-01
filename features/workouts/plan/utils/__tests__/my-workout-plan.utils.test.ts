import { describe, expect, it } from '@jest/globals';
import { DateTime } from 'luxon';
import { calculateWeeklyProgress, deriveWorkoutWeekDays } from '../my-workout-plan.utils';

describe('my workout plan utilities', () => {
  it('builds the training week from Sunday through Saturday', () => {
    const days = deriveWorkoutWeekDays(
      { byDate: {} },
      DateTime.fromISO('2026-09-01T12:00:00', { zone: 'Asia/Jerusalem' }),
    );

    expect(days.map((day) => day.date)).toEqual([
      '2026-08-30',
      '2026-08-31',
      '2026-09-01',
      '2026-09-02',
      '2026-09-03',
      '2026-09-04',
      '2026-09-05',
    ]);
    expect(days[2].isToday).toBe(true);
  });

  it('clamps weekly progress to the valid range', () => {
    expect(calculateWeeklyProgress(2, 4)).toBe(0.5);
    expect(calculateWeeklyProgress(6, 4)).toBe(1);
    expect(calculateWeeklyProgress(2, 0)).toBe(0);
  });
});
