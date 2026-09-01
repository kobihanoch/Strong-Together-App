import type { TrackingMapItem } from '../../shared/types/workout.types';
import type { ExerciseAssignment } from '../../shared/types/workout.types';
import type { WorkoutSplit } from '../../shared/types/workout.types';

export const getLastWorkoutForEachExercise = (
  date: string,
  byDate: Record<string, Array<Omit<TrackingMapItem, 'workoutDate'>>>,
  bySplitName: Record<WorkoutSplit['name'], Array<Omit<TrackingMapItem, 'splitName'>>>,
  byExerciseToSplitId: Record<ExerciseAssignment['id'], TrackingMapItem[]>,
) => {
  const etRecords = byDate[date];
  if (!Array.isArray(etRecords) || etRecords.length === 0) return [];

  // Iterate over each exercise record of selected date
  return etRecords.reduce((acc: ((TrackingMapItem | undefined) & { isLastWorkout: boolean })[], ex) => {
    // Get all instances of specific exercise
    const etsArr = byExerciseToSplitId[ex.exerciseToSplitId] ?? [];

    // Find index of last log
    const iNow = etsArr.findIndex((r) => r.workoutDate === date);
    const lastLog = iNow >= 0 ? etsArr[iNow + 1] : etsArr.find((r) => r.workoutDate < date);

    // If no last log of exercise => Continue to next exercise
    if (!lastLog) return acc;

    // Get date of last workout same as this one
    const dates = [...new Set((bySplitName[ex.splitName] || []).map((r) => r.workoutDate))];
    const j = dates.indexOf(date);
    const lastSplitDate = j >= 0 ? dates[j + 1] : dates.find((d) => d < date);

    acc.push({
      ...lastLog,
      isLastWorkout: !!lastSplitDate && lastLog.workoutDate === lastSplitDate,
    });
    return acc;
  }, []);
};
