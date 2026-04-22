import { TrackingMapItem } from '@strong-together/shared';
import { ExerciseToWorkoutSplitEntity } from '@strong-together/shared';
import { WorkoutSplitEntity } from '@strong-together/shared';

export const getLastWorkoutForEachExercise = (
  date: string,
  byDate: Record<string, Array<Omit<TrackingMapItem, 'workoutdate'>>>,
  bySplitName: Record<WorkoutSplitEntity['name'], Array<Omit<TrackingMapItem, 'splitname'>>>,
  byETSId: Record<ExerciseToWorkoutSplitEntity['id'], TrackingMapItem[]>,
) => {
  const etRecords = byDate[date];
  if (!Array.isArray(etRecords) || etRecords.length === 0) return [];

  // Iterate over each exercise record of selected date
  return etRecords.reduce((acc: ((TrackingMapItem | undefined) & { isLastWorkout: boolean })[], ex) => {
    // Get all instances of specific exercise
    const etsArr = byETSId[ex.exercisetosplit_id] ?? [];

    // Find index of last log
    const iNow = etsArr.findIndex((r) => r.workoutdate === date);
    const lastLog = iNow >= 0 ? etsArr[iNow + 1] : etsArr.find((r) => r.workoutdate < date);

    // If no last log of exercise => Continue to next exercise
    if (!lastLog) return acc;

    // Get date of last workout same as this one
    const dates = [...new Set((bySplitName[ex.splitname] || []).map((r) => r.workoutdate))];
    const j = dates.indexOf(date);
    const lastSplitDate = j >= 0 ? dates[j + 1] : dates.find((d) => d < date);

    acc.push({
      ...lastLog,
      isLastWorkout: !!lastSplitDate && lastLog.workoutdate === lastSplitDate,
    });
    return acc;
  }, []);
};
