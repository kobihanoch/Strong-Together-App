import { useMemo } from "react";
import { useAnalysisContext } from "../context/AnalysisContext";

const useLastWorkoutExerciseTrackingData = (exerciseToSplitId) => {
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
