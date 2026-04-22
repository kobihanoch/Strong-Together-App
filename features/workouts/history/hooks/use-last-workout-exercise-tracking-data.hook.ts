import { useMemo } from 'react';
import { useWorkoutHistoryContext } from '../../shared/providers/WorkoutHistoryProvider';
import { ExerciseToWorkoutSplitEntity } from '@strong-together/shared';
import { TrackingMapItem } from '@strong-together/shared';

const useLastWorkoutExerciseTrackingData = (
  exerciseToSplitId: ExerciseToWorkoutSplitEntity['id'],
): { lastWorkoutData: TrackingMapItem | null } => {
  const { exerciseTrackingMaps } = useWorkoutHistoryContext();
  const lastWorkoutData = useMemo(() => {
    const allRecords = exerciseTrackingMaps?.byETSId?.[exerciseToSplitId];
    if (!allRecords) return null;
    const recordForEx = allRecords[0]; // Latest
    return recordForEx;
  }, [exerciseTrackingMaps, exerciseToSplitId]);

  return { lastWorkoutData };
};

export default useLastWorkoutExerciseTrackingData;


