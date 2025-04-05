import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useUserWorkout } from "../useUserWorkout";
import {
  filterZeroesInArr,
  createObjectForDataBase,
} from "../../utils/startWorkoutUtils";

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

  // --------------------[ Save Workout ]-----------------------------------------

  const [saveStarted, setSaveStarted] = useState(false);

  useEffect(() => {
    console.log("Saving started!");
    const { reps: rDup, weights: wDup } = filterZeroesInArr(
      repsArrs,
      weightArrs
    );
    console.log("Sorted reps array: " + JSON.stringify(rDup));
    console.log("Sorted weight array: " + JSON.stringify(wDup));
    const obj = createObjectForDataBase(
      user.id,
      wDup,
      rDup,
      exercisesForSelectedSplit
    );
  }, [saveStarted]);

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
    saving: {
      saveStarted,
      setSaveStarted,
    },
    loading,
    error,
  };
};

export default useStartWorkoutPageLogic;
