import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { unpackFromExerciseTrackingData } from "../../utils/analysisContexUtils";
import {
  applyNotes,
  applyReps,
  applyWeight,
  countSetsDone,
  createArrayForDataBase,
} from "../../utils/startWorkoutUtils";
import { useUserWorkout } from "../useUserWorkout";
import { showErrorAlert } from "../../errors/errorAlerts";
import { cacheDeleteKey } from "../../cache/cacheUtils";
import { useStartWorkoutCache } from "../useStartWorkoutCache";

const useStartWorkoutPageLogic = (selectedSplit, resumedWorkout = null) => {
  // --------------------[ Navigation ]--------------------------------------
  const navigation = useNavigation();
  // --------------------[ Context ]--------------------------------------
  const { user, setIsWorkoutMode } = useAuth();
  const { exercises = {} } = useWorkoutContext() || {};
  const {
    setExerciseTrackingMaps = null,
    setAnalyzedExerciseTrackingData = null,
  } = useAnalysisContext() || {};

  // --------------------[ Set workout mode ]--------------------------------------
  useFocusEffect(
    useCallback(() => {
      setIsWorkoutMode(true);
      return () => {
        setIsWorkoutMode(false);
      };
    }, [])
  );

  // --------------------[ Exercises and Workout Name ]------------------------------------------
  // Set exercises array for selected split
  const exercisesForSelectedSplit = useMemo(() => {
    return exercises[selectedSplit.name] || [];
  }, [exercises, selectedSplit]);

  // Always an array
  const totalSets = exercisesForSelectedSplit.reduce((sum, ex) => {
    sum += ex.sets.length;
    return sum;
  }, 0);

  const workoutName = selectedSplit?.name;

  // --------------------[ Progress object ]--------------------------------------
  // Key value obj with ex name key and weights and reps arrays, etsid, notes
  const [workoutProgressObj, setWorkoutProgressObj] = useState(() => {
    if (resumedWorkout) return resumedWorkout.workout;
    return exercisesForSelectedSplit.reduce((acc, ex) => {
      acc[ex.exercise] = { etsid: ex.id, weight: [], reps: [], notes: null };
      return acc;
    }, {});
  });

  // --------------------[ Timer + Caching ]----------------------
  const { cacheKey, startTime, pausedTotal } = useStartWorkoutCache(
    user.id,
    selectedSplit,
    resumedWorkout,
    workoutProgressObj
  );

  // Count only after both fields has updated and count
  // Count only until planned sets by original workout plan
  const { sum: setsDone = 0, byExercise: setsDoneWithExerciseNameKey = {} } =
    useMemo(
      () => countSetsDone(workoutProgressObj, exercisesForSelectedSplit),
      [workoutProgressObj, exercisesForSelectedSplit]
    );

  // --------------------[ Add progress ]-----------------------------------------
  const addWeightRecord = useCallback((exerciseName, setIndex, weight) => {
    setWorkoutProgressObj((prev) =>
      applyWeight(prev, exerciseName, setIndex, weight)
    );
  }, []);

  const addRepsRecord = useCallback((exerciseName, setIndex, reps) => {
    setWorkoutProgressObj((prev) =>
      applyReps(prev, exerciseName, setIndex, reps)
    );
  }, []);

  const addNotes = useCallback((exerciseName, notes) => {
    setWorkoutProgressObj((prev) => applyNotes(prev, exerciseName, notes));
  }, []);

  // --------------------[ Testing ]---------------------------------------------
  useEffect(() => {
    if (exercisesForSelectedSplit && exercisesForSelectedSplit.length) {
      addWeightRecord("Incline Bench Press", 0, 10);
      addWeightRecord("Incline Bench Press", 2, 30);
      addWeightRecord("Incline Bench Press", 1, 20.5);
      addRepsRecord("Incline Bench Press", 0, 12);
      addRepsRecord("Incline Bench Press", 2, 12);
      addRepsRecord("Incline Bench Press", 1, 12);
      addWeightRecord("Chest Fly", 0, 15.5);
      addWeightRecord("Chest Fly", 1, 17.5);
      addRepsRecord("Chest Fly", 0, 12);
      addRepsRecord("Chest Fly", 1, 15);
      addNotes("Incline Bench Press", "Was easy!");
    }
    //console.log(workoutProgressObj);
  }, [exercisesForSelectedSplit]);

  // --------------------[ Save Workout ]-----------------------------------------
  const { saveWorkoutProcess } = useUserWorkout();
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

      navigation.navigate("Statistics");
      await cacheDeleteKey(cacheKey);
    } catch (err) {
      throw err;
    } finally {
      setSaveStarted(false);
    }
  }, [workoutProgressObj, cacheKey]);

  return {
    data: {
      exercisesForSelectedSplit,
      startTime,
      pausedTotal,
      totalSets,
      workoutName,
      setsDone,
      setsDoneWithExerciseNameKey,
    },
    controls: {
      addNotes,
      addRepsRecord,
      addWeightRecord,
    },
    saving: {
      saveStarted,
      saveData,
    },
  };
};

export default useStartWorkoutPageLogic;
