import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useUserWorkout } from "../useUserWorkout";

const useStartWorkoutPageLogic = (user, selectedSplit) => {
  // --------------------[ Outside hooks ]--------------------------------------
  const { exercises, loading, error } = useUserWorkout(user?.id);

  // --------------------[ Exercises ]------------------------------------------
  const [exercisesForSelectedSplit, setExercisesForSelectedSplit] =
    useState(null);

  // Set exercises array for selected split
  useEffect(() => {
    if (exercises) {
      setExercisesForSelectedSplit(
        exercises.filter((ex) => ex.workoutsplit_id === selectedSplit.id)
      );
    }
  }, [exercises]);

  // --------------------[ Glow Animation ]-----------------------------------------
  const glowAnimation = useRef(new Animated.Value(1)).current;

  return {
    animation: {
      glowAnimation,
    },
    data: {
      exercisesForSelectedSplit,
    },
    loading,
    error,
  };
};

export default useStartWorkoutPageLogic;
