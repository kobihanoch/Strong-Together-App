import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createObjectForDataBase,
  filterZeroesInArr,
} from "../../utils/startWorkoutUtils";
import { useUserWorkout } from "../useUserWorkout";

const useStartWorkoutPageLogic = (user, selectedSplit, setHasTrainedToday) => {
  // --------------------[ Auth Context ]--------------------------------------
  const { workout, setIsWorkoutMode } = useAuth();

  // --------------------[ Navigation ]--------------------------------------
  const navigation = useNavigation();

  // --------------------[ Outside hooks ]--------------------------------------
  const { saveWorkoutProcess } = useUserWorkout();

  // --------------------[ Set workout mode ]--------------------------------------
  useFocusEffect(
    useCallback(() => {
      setIsWorkoutMode(true);

      return () => {
        setIsWorkoutMode(false);
      };
    }, [])
  );

  // --------------------[ Exercises ]------------------------------------------
  const { exercises, setExerciseTracking } = workout;

  // Set exercises array for selected split
  const exercisesForSelectedSplit = useMemo(() => {
    return exercises.filter((ex) => ex.workoutsplit_id === selectedSplit.id);
  }, [exercises]);

  // --------------------[ Weight and Reps arrays ]-----------------------------------------

  const [weightArrs, setWeightArrs] = useState([]);
  const [repsArrs, setRepsArrs] = useState([]);

  // --------------------[ Save Workout ]-----------------------------------------

  const [saveStarted, setSaveStarted] = useState(false);

  const saveData = useCallback(async () => {
    setSaveStarted(true);
    console.log("Saving started!");
    try {
      const { reps: rDup, weights: wDup } = filterZeroesInArr(
        repsArrs,
        weightArrs
      );
      const obj = createObjectForDataBase(
        user.id,
        wDup,
        rDup,
        exercisesForSelectedSplit
      );
      // Need to get exercise trackigg back for cache
      const addedEt = await saveWorkoutProcess(obj);

      // Update cache
      setExerciseTracking((prev) => [...prev, ...addedEt]);
      setHasTrainedToday(true);
      setIsWorkoutMode(false);
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      navigation.navigate("Statistics");
      setSaveStarted(false);
    }
  });

  return {
    data: {
      exercisesForSelectedSplit,
      weightArrs,
      setWeightArrs,
      repsArrs,
      setRepsArrs,
    },
    saving: {
      saveStarted,
      saveData,
    },
  };
};

export default useStartWorkoutPageLogic;
