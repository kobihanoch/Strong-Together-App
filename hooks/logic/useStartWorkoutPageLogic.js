import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { unpackFromExerciseTrackingData } from "../../utils/analysisContexUtils";
import { createArrayForDataBase } from "../../utils/startWorkoutUtils";
import { useUserWorkout } from "../useUserWorkout";
import { showErrorAlert } from "../../errors/errorAlerts";

const useStartWorkoutPageLogic = (selectedSplit) => {
  // --------------------[ Context ]--------------------------------------
  const { user, setIsWorkoutMode } = useAuth();
  const { exercises = null } = useWorkoutContext() || {};
  const {
    setExerciseTrackingMaps = null,
    setAnalyzedExerciseTrackingData = null,
  } = useAnalysisContext() || {};

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

  // Set exercises array for selected split
  const exercisesForSelectedSplit = useMemo(() => {
    return exercises[selectedSplit.name];
  }, [exercises]);

  // --------------------[ Weight and Reps arrays ]-----------------------------------------

  // Key value obj with ETSID key and weights and reps arrays
  const [workoutProgressObj, setWorkoutProgressObj] = useState(() => {
    return exercisesForSelectedSplit.reduce((acc, ex) => {
      acc[ex.exercise] = {
        etsid: ex.id,
        weight: [],
        reps: [],
        notes: null,
      };
      return acc;
    }, {});
  });

  // --------------------[ Add progress ]-----------------------------------------

  const addWeightRecord = useCallback((exerciseName, setIndex, weight) => {
    setWorkoutProgressObj((prev) => {
      const exerciseInObj = prev[exerciseName];
      const currentExerciseWeightArray = [...exerciseInObj.weight] || [];
      currentExerciseWeightArray[setIndex] = weight;
      return {
        ...prev,
        [exerciseName]: {
          ...exerciseInObj,
          weight: currentExerciseWeightArray,
        },
      };
    });
  }, []);

  const addRepsRecord = useCallback((exerciseName, setIndex, reps) => {
    setWorkoutProgressObj((prev) => {
      const exerciseInObj = prev[exerciseName];
      const currentExerciseRepsArray = [...exerciseInObj.reps] || [];
      currentExerciseRepsArray[setIndex] = reps;
      return {
        ...prev,
        [exerciseName]: {
          ...exerciseInObj,
          reps: currentExerciseRepsArray,
        },
      };
    });
  }, []);

  const addNotes = useCallback((exerciseName, notes) => {
    setWorkoutProgressObj((prev) => {
      const exerciseInObj = prev[exerciseName];
      return {
        ...prev,
        [exerciseName]: {
          ...exerciseInObj,
          notes: notes,
        },
      };
    });
  }, []);

  // Testing
  useEffect(() => {
    addWeightRecord("Incline Bench Press", 0, 10);
    addWeightRecord("Incline Bench Press", 2, 30);
    addWeightRecord("Incline Bench Press", 1, 20.5);
    addRepsRecord("Incline Bench Press", 1, 12);
    addWeightRecord("Chest Fly", 0, 15.5);
    addWeightRecord("Chest Fly", 1, 17.5);
    addRepsRecord("Chest Fly", 0, 12);
    addRepsRecord("Chest Fly", 1, 15);
    addNotes("Incline Bench Press", "Was easy!");
    //console.log(workoutProgressObj);
  }, []);

  // --------------------[ Save Workout ]-----------------------------------------

  const [saveStarted, setSaveStarted] = useState(false);

  const saveData = useCallback(async () => {
    setSaveStarted(true);
    console.log("Saving started!");
    try {
      // Trims zeros in array and creates an array of rows object as database requires
      const arr = createArrayForDataBase(workoutProgressObj);
      if (!arr.length) {
        showErrorAlert("Saving Error", "Please perform at least one set");
        return;
      }

      const res = await saveWorkoutProcess(arr);
      const { exerciseTrackingMaps, exerciseTrackingAnalysis } = res;

      // Update context
      setExerciseTrackingMaps(exerciseTrackingMaps);
      setAnalyzedExerciseTrackingData(
        unpackFromExerciseTrackingData(exerciseTrackingAnalysis)
      );
      setIsWorkoutMode(false);

      // Delete analytics cache
      //await cacheDeleteKey(keyAnalytics(user.id));
      //console.log("Analytics deleted");
      navigation.navigate("Statistics");
    } catch (err) {
      throw err;
    } finally {
      setSaveStarted(false);
    }
  }, [workoutProgressObj]);

  return {
    data: {
      exercisesForSelectedSplit,
      setWorkoutProgressObj,
    },
    saving: {
      saveStarted,
      saveData,
    },
  };
};

export default useStartWorkoutPageLogic;
