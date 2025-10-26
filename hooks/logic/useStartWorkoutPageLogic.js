import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import { cacheDeleteKey, keyStartWorkout } from "../../cache/cacheUtils";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { showErrorAlert } from "../../errors/errorAlerts";
import { unpackFromExerciseTrackingData } from "../../utils/analysisContexUtils";
import {
  applyNotes,
  applyReps,
  applyWeight,
  countSetsDone,
  createArrayForDataBase,
} from "../../utils/startWorkoutUtils";
import { useStartWorkoutCache } from "../useStartWorkoutCache";
import { useUserWorkout } from "../useUserWorkout";

const useStartWorkoutPageLogic = (selectedSplit, resumedWorkout = null) => {
  // --------------------[ Navigation ]--------------------------------------
  const navigation = useNavigation();
  // --------------------[ Context ]--------------------------------------
  const { user, setIsWorkoutMode, userIdCache } = useAuth();
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

  /*useEffect(() => {
    console.log(JSON.stringify(workoutProgressObj, null, 2));
  }, [workoutProgressObj]);*/

  // --------------------[ Timer + Caching ]----------------------
  const { cacheKey, startTime, pausedTotal, disableCache } =
    useStartWorkoutCache(
      userIdCache, // Save cache with user id from cache for better offline experience
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

  // --------------------[ Save Workout ]-----------------------------------------
  const clearCache = useCallback(async () => {
    await cacheDeleteKey(keyStartWorkout(userIdCache));
  }, [cacheKey]);

  const onExit = async () => {
    await clearCache();
    // Force unmounting
    navigation.replace("MyWorkoutPlan");
  };

  const { saveWorkoutProcess } = useUserWorkout();
  const [saveStarted, setSaveStarted] = useState(false);
  const saveLock = useRef(false);

  const saveData = useCallback(async () => {
    if (saveLock.current) return;
    saveLock.current = true;
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
      disableCache();
      await clearCache();
      navigation.replace("Statistics");
    } catch (err) {
      throw err;
    } finally {
      setSaveStarted(false);
      saveLock.current = false;
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
    onExit,
    workoutProgressObj,
  };
};

export default useStartWorkoutPageLogic;
