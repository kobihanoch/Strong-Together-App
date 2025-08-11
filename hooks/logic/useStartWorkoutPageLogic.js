import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getUserExerciseTracking } from "../../services/WorkoutService";
import {
  createObjectForDataBase,
  filterZeroesInArr,
  getWorkoutCompleteMessageString,
} from "../../utils/startWorkoutUtils";
import useSystemMessages from "../automations/useSystemMessages";
import { useUserWorkout } from "../useUserWorkout";

const useStartWorkoutPageLogic = (user, selectedSplit, setHasTrainedToday) => {
  // --------------------[ Auth Context ]--------------------------------------
  const { workout, setIsWorkoutMode } = useAuth();

  // --------------------[ Navigation ]--------------------------------------
  const navigation = useNavigation();

  // --------------------[ Outside hooks ]--------------------------------------
  const { saveWorkoutProccess } = useUserWorkout(user?.id);

  const { sendSystemMessage } = useSystemMessages(user?.id);

  // --------------------[ Set workout mode ]--------------------------------------
  useFocusEffect(
    React.useCallback(() => {
      setIsWorkoutMode(true);

      return () => {
        setIsWorkoutMode(false);
      };
    }, [])
  );

  // --------------------[ Exercises ]------------------------------------------
  const { exercises, setExerciseTracking } = workout;

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
    const saveData = async () => {
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
        await saveWorkoutProccess(obj);

        // Update cache
        const etUpdated = await getUserExerciseTracking(user.id);
        setExerciseTracking(etUpdated);
        setHasTrainedToday(true);
        setIsWorkoutMode(false);
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        navigation.navigate("Statistics");
        setSaveStarted(false);
      }
    };

    if (saveStarted) {
      saveData();
    }
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
  };
};

export default useStartWorkoutPageLogic;
