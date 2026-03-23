import { useMemo } from 'react';
import { useAnalysisContext } from '../context/AnalysisContext';
import { ExerciseToWorkoutSplitEntity } from '../types/entities/exerciseToWorkoutSplit.entity';
import { TrackingMapItem } from '../types/dto/exerciseTracking.dto';

const useLastWorkoutExerciseTrackingData = (
  exerciseToSplitId: ExerciseToWorkoutSplitEntity['id'],
): { lastWorkoutData: TrackingMapItem | null } => {
  const { exerciseTrackingMaps } = useAnalysisContext();
  const lastWorkoutData = useMemo(() => {
    const allRecords = exerciseTrackingMaps?.byETSId?.[exerciseToSplitId];
    if (!allRecords) return null;
    const recordForEx = allRecords[0]; // Latest
    return recordForEx;
  }, [exerciseTrackingMaps, exerciseToSplitId]);

  return { lastWorkoutData };
};

export default useLastWorkoutExerciseTrackingData;
