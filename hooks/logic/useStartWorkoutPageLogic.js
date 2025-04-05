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

  // --------------------[ Weight and Reps arrays ]-----------------------------------------

  const [weightArrs, setWeightArrs] = useState([]);
  const [repsArrs, setRepsArrs] = useState([]);

  // --------------------[ Glow Animation ]-----------------------------------------
  const glowAnimation = useRef(new Animated.Value(1)).current;

  return {
    animation: {
      glowAnimation,
    },
    data: {
      exercisesForSelectedSplit,
      weightArrs,
      setWeightArrs,
      repsArrs,
      setRepsArrs,
    },
    loading,
    error,
  };
};

export default useStartWorkoutPageLogic;
