import { colors } from '../../../../shared/constants/colors';
import { CardioWeeklyData } from '../types/cardio.types';

export const getDayAbbreviation = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Sun"
};

export const normalizeDataToWeeklyCardioGraph = (data: CardioWeeklyData['records']) => {
  if (!Array.isArray(data)) return [];

  // Step 1: Initialize empty week map
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  // Step 2: Fill values from actual data
  data.forEach((rec) => {
    const label = getDayAbbreviation(rec.workoutTimeUtc); // e.g., "Tue"
    if (label in dayMap) {
      dayMap[label] += rec.durationMins ?? 0;
    }
  });

  // Step 3: Return as array in correct order
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => ({
    label,
    value: dayMap[label],
    frontColor: colors.primary,
  }));
};
