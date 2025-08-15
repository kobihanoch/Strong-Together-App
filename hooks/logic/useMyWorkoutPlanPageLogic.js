import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  countExercisesForSplit,
  filterExercises,
  getWorkoutSplitCounter,
} from "../../utils/myWorkoutPlanUtils";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { useAnalysisContext } from "../../context/AnalysisContext";

export const useMyWorkoutPlanPageLogic = () => {
  const {
    workout,
    workoutSplits,
    exercises: allExercises,
  } = useWorkoutContext();

  const { exerciseTracking, hasTrainedToday } = useAnalysisContext();
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [buttonOpacity, setButtonOpacity] = useState(1);

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
    return getWorkoutSplitCounter(selectedSplit?.name, exerciseTracking);
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
      countExercisesForSplit,
      buttonOpacity,
      splitTrainedCount,
      hasTrainedToday,
    },
  };
};
