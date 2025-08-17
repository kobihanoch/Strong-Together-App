import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useWorkoutContext } from "../../context/WorkoutContext";

export const useMyWorkoutPlanPageLogic = () => {
  const {
    workout,
    workoutSplits,
    exercises: allExercises,
  } = useWorkoutContext();

  const { exerciseTracking, analyzedExerciseTrackingData, hasTrainedToday } =
    useAnalysisContext();
  const [selectedSplit, setSelectedSplit] = useState(null);

  // Set selected split at startup
  useEffect(() => {
    if (workoutSplits && workoutSplits.length > 0) {
      setSelectedSplit(workoutSplits[0]);
    }
  }, [workoutSplits]);

  // Filter exercises by selected split
  const filteredExercises = useMemo(() => {
    if (!selectedSplit) return;
    return allExercises[selectedSplit.name];
  }, [allExercises, selectedSplit]);

  // Gets preformed split count
  const splitTrainedCount = useMemo(() => {
    return analyzedExerciseTrackingData.splitDaysByName[selectedSplit?.name];
  }, [exerciseTracking, selectedSplit]);

  // Handling selection of split
  const handleWorkoutSplitPress = useCallback((split) => {
    setSelectedSplit(split);
  }, []);

  return {
    data: {
      workout,
      workoutSplits,
      allExercises,
      selectedSplit,
      setSelectedSplit,
      handleWorkoutSplitPress,
      filteredExercises,
      splitTrainedCount,
      hasTrainedToday,
    },
  };
};
