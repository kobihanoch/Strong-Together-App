export type HomeDashboardMock = {
  nextWorkout: { name: string; exerciseCount: number; setCount: number };
  gymActivity: { completedThisWeek: number; weeklyTarget: number; weekStreak: number };
  aerobics: { totalMinutes: number; days: Array<{ label: string; minutes: number }> };
  achievement: { exercise: string; value: string };
  estimatedOneRepMax: { exercise: string; valueKg: number; trend: number[] };
  lastWorkout: { name: string; dateLabel: string; exerciseCount: number; setCount: number };
};

// Temporary switch for visual development. Remove when the dashboard is fully live.
export const USE_MOCK_AEROBICS = true;

// Temporary presentation data. It mirrors the future context-derived view model.
export const HOME_DASHBOARD_MOCK: HomeDashboardMock = {
  nextWorkout: { name: 'Push Day', exerciseCount: 6, setCount: 18 },
  gymActivity: { completedThisWeek: 3, weeklyTarget: 4, weekStreak: 6 },
  aerobics: {
    totalMinutes: 82,
    days: [
      { label: 'M', minutes: 12 }, { label: 'T', minutes: 18 }, { label: 'W', minutes: 10 },
      { label: 'T', minutes: 6 }, { label: 'F', minutes: 15 }, { label: 'S', minutes: 5 },
      { label: 'S', minutes: 16 },
    ],
  },
  achievement: { exercise: 'Bench Press', value: '+5 kg PR' },
  estimatedOneRepMax: { exercise: 'Bench Press', valueKg: 117.5, trend: [92, 99, 101, 108, 117.5] },
  lastWorkout: { name: 'Pull Day', dateLabel: 'May 18', exerciseCount: 6, setCount: 17 },
};
