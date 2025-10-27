import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { useAuth } from "../../context/AuthContext";

export const useMyWorkoutPlanPageLogic = () => {
  const {
    workout,
    workoutForEdit,
    workoutSplits,
    exercises: allExercises,
  } = useWorkoutContext();

  const hasWorkout = useMemo(() => !!workout, [workout]);

  const exerciseCounter = useMemo(() => {
    if (!hasWorkout) return;
    return Object.entries(workoutForEdit).reduce((acc, [s, ex]) => {
      const exCount = ex.length;
      const splitName = s;
      acc[splitName] = exCount;
      return acc;
    }, {});
  }, [hasWorkout, workoutForEdit]);

  const { analyzedExerciseTrackingData, hasTrainedToday } =
    useAnalysisContext();
  const { workoutCount = 0 } = analyzedExerciseTrackingData || {};
  const canWorkout = workoutCount <= 3;
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
    if (!analyzedExerciseTrackingData) return;
    return (
      analyzedExerciseTrackingData?.splitDaysByName?.[selectedSplit?.name] ?? 0
    );
  }, [analyzedExerciseTrackingData, selectedSplit]);

  // Handling selection of split
  const handleWorkoutSplitPress = useCallback((split) => {
    setSelectedSplit(split);
  }, []);

  return {
    workout,
    hasWorkout,
    workoutSplits,
    allExercises,
    selectedSplit,
    setSelectedSplit,
    handleWorkoutSplitPress,
    filteredExercises,
    splitTrainedCount,
    hasTrainedToday,
    exerciseCounter,
    canWorkout,
  };
};
