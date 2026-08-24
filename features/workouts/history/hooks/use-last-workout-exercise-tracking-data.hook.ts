import { useMemo } from 'react';
import { useWorkoutHistoryContext } from '../../shared/providers/WorkoutHistoryProvider';
import type { ExerciseAssignment } from '../../shared/types/workout.types';
import type { TrackingMapItem } from '../../shared/types/workout.types';

const useLastWorkoutExerciseTrackingData = (
  exerciseToSplitId: ExerciseAssignment['id'],
): { lastWorkoutData: TrackingMapItem | null } => {
  const { exerciseTrackingMaps } = useWorkoutHistoryContext();
  const lastWorkoutData = useMemo(() => {
    const allRecords = exerciseTrackingMaps?.byExerciseToSplitId?.[exerciseToSplitId];
    if (!allRecords) return null;
    const recordForEx = allRecords[0]; // Latest
    return recordForEx;
  }, [exerciseTrackingMaps, exerciseToSplitId]);

  return { lastWorkoutData };
};

export default useLastWorkoutExerciseTrackingData;


