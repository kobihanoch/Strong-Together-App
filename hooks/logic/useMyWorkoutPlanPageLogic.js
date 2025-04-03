import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useUserWorkout } from "../useUserWorkout";
import {
  filterExercises,
  countExercisesForSplit,
  getWorkoutSplitCounter,
} from "../../utils/myWorkoutPlanUtils";

export const useMyWorkoutPlanPageLogic = (user) => {
  const {
    workout,
    workoutSplits,
    exerciseTracking,
    fetchUserExerciseTracking,
    exercises: allExercises,
    loading,
    error,
  } = useUserWorkout(user?.id);

  const [selectedSplit, setSelectedSplit] = useState(null);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [filteredExercises, setFilteredExercises] = useState(null);
  const [splitTrainedCount, setSplitTrainedCount] = useState(0);

  // Initialize exercise tracking fetch
  useEffect(() => {
    if (user) {
      fetchUserExerciseTracking();
    }
  }, [user]);

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
    },
    loading,
    error,
  };
};
