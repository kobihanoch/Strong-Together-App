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

  useEffect(() => {
    if (workoutSplits && workoutSplits.length > 0) {
      setSelectedSplit(workoutSplits[0]);
    }
  }, [workoutSplits]);

  const filteredExercises = selectedSplit
    ? allExercises.filter(
        (exercise) => exercise.workoutsplit_id === selectedSplit.id
      )
    : [];

  const handleWorkoutSplitPress = (split) => {
    setSelectedSplit(split);
  };

  const countExercisesForSplit = (splitId) => {
    return allExercises.filter(
      (exercise) => exercise.workoutsplit_id === splitId
    ).length;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setButtonOpacity((prev) => (prev === 1 ? 0.8 : 1));
    }, 750);
    return () => clearInterval(interval);
  }, []);

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
