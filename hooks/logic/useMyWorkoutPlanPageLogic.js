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
} from "../../utils/myWorkoutPlanUtils";

export const useMyWorkoutPlanPageLogic = (user) => {
  const {
    workout,
    workoutSplits,
    exercises: allExercises,
    loading,
    error,
  } = useUserWorkout(user?.id);

  const [selectedSplit, setSelectedSplit] = useState(null);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [filteredExercises, setFilteredExercises] = useState(null);

  useEffect(() => {
    if (workoutSplits && workoutSplits.length > 0) {
      setSelectedSplit(workoutSplits[0]);
    }
  }, [workoutSplits]);

  useEffect(() => {
    if (allExercises && allExercises.length > 0) {
      setFilteredExercises(filterExercises(allExercises, selectedSplit));
    }
  }, [allExercises, selectedSplit]);

  useEffect(() => {
    const interval = setInterval(() => {
      setButtonOpacity((prev) => (prev === 1 ? 0.8 : 1));
    }, 750);
    return () => clearInterval(interval);
  }, []);

  const handleWorkoutSplitPress = (split) => {
    setSelectedSplit(split);
  };

  return {
    workout,
    workoutSplits,
    allExercises,
    loading,
    error,
    selectedSplit,
    setSelectedSplit,
    handleWorkoutSplitPress,
    filteredExercises,
    countExercisesForSplit,
    buttonOpacity,
  };
};
