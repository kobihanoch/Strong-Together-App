import { useEffect, useState } from "react";
import {
  countExercisesForSplit,
  filterExercises,
  getWorkoutSplitCounter,
} from "../../utils/myWorkoutPlanUtils";
import { useUserWorkout } from "../useUserWorkout";

export const useMyWorkoutPlanPageLogic = (user, authHasTrainedToday) => {
  const {
    workout,
    workoutSplits,
    exerciseTracking,
    fetchUserExerciseTracking,
    exercises: allExercises,
    loading,
    error,
    refetch,
  } = useUserWorkout(user?.id);

  const [selectedSplit, setSelectedSplit] = useState(null);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [filteredExercises, setFilteredExercises] = useState(null);
  const [splitTrainedCount, setSplitTrainedCount] = useState(0);
  const [hasTrainedToday, setHasTrainedToday] = useState(false);

  // Initialize exercise tracking fetch
  useEffect(() => {
    if (user) {
      fetchUserExerciseTracking();
    }
  }, [user]);

  useEffect(() => {
    setHasTrainedToday(authHasTrainedToday);
  }, [authHasTrainedToday]);

  // Set selected split at startup
  useEffect(() => {
    if (workoutSplits && workoutSplits.length > 0) {
      setSelectedSplit(workoutSplits[0]);
    }
  }, [workoutSplits]);

  // Gets preformed split count
  useEffect(() => {
    if (exerciseTracking && selectedSplit) {
      setSplitTrainedCount(
        getWorkoutSplitCounter(selectedSplit?.name, exerciseTracking)
      );
    }
  }, [exerciseTracking, selectedSplit]);

  // Filter exercises by selected split
  useEffect(() => {
    if (allExercises && allExercises.length > 0) {
      setFilteredExercises(filterExercises(allExercises, selectedSplit));
    }
  }, [allExercises, selectedSplit]);

  // Setting selected split when button is pressed
  const handleWorkoutSplitPress = (split) => {
    setSelectedSplit(split);
  };

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
    loading,
    error,
    refetch,
  };
};
