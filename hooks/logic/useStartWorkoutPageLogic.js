import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { useUserWorkout } from "../useUserWorkout";
import {
  filterZeroesInArr,
  createObjectForDataBase,
  getWorkoutCompleteMessageString,
} from "../../utils/startWorkoutUtils";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import useSystemMessages from "../automations/useSystemMessages";

const useStartWorkoutPageLogic = (user, selectedSplit, setHasTrainedToday) => {
  // --------------------[ Navigation ]--------------------------------------
  const navigation = useNavigation();

  // --------------------[ Outside hooks ]--------------------------------------
  const { exercises, saveWorkoutProccess, loading, error } = useUserWorkout(
    user?.id
  );

  const { sendSystemMessage } = useSystemMessages(user?.id);

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
        setHasTrainedToday(true);
        // Send a message to user
        await sendSystemMessage(
          getWorkoutCompleteMessageString().header,
          getWorkoutCompleteMessageString().text
        );
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
    loading,
    error,
  };
};

export default useStartWorkoutPageLogic;
