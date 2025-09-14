import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { useAuth } from "../../context/AuthContext";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { unpackFromExerciseTrackingData } from "../../utils/analysisContexUtils";
import { createArrayForDataBase } from "../../utils/startWorkoutUtils";
import { useUserWorkout } from "../useUserWorkout";
import { showErrorAlert } from "../../errors/errorAlerts";
import {
  cacheDeleteKey,
  cacheSetJSON,
  keyStartWorkout,
  TTL_36H,
} from "../../cache/cacheUtils";

const useStartWorkoutPageLogic = (selectedSplit, resumedWorkout = null) => {
  // --------------------[ Context ]--------------------------------------
  const { user, setIsWorkoutMode } = useAuth();
  const cacheKey = keyStartWorkout(user.id);
  const { exercises = {} } = useWorkoutContext() || {};
  const {
    setExerciseTrackingMaps = null,
    setAnalyzedExerciseTrackingData = null,
  } = useAnalysisContext() || {};

  // --------------------[ Exercises ]------------------------------------------

  // Set exercises array for selected split
  const exercisesForSelectedSplit = useMemo(() => {
    return exercises[selectedSplit.name] || [];
  }, [exercises, selectedSplit]);

  // --------------------[ Navigation ]--------------------------------------
  const navigation = useNavigation();

  // --------------------[ Outside hooks ]--------------------------------------
  const { saveWorkoutProcess } = useUserWorkout();

  // --------------------[ Weight and Reps arrays + Start time ]-----------------------------------------

  // Start time cacluated once at mounting, clears on unmounting
  const [pausedTotal, setPausedTotal] = useState(
    resumedWorkout ? resumedWorkout.pausedTotal : 0
  );
  const startTime = useMemo(
    () => (resumedWorkout ? resumedWorkout.startTime : Date.now()),
    [resumedWorkout]
  );

  // Total pause time
  useEffect(() => {
    const lp = resumedWorkout?.lastPause;
    if (typeof lp === "number" && Number.isFinite(lp)) {
      const delta = Math.max(0, Date.now() - lp); // clamp against negatives
      setPausedTotal((prev) => prev + delta);
    }
    // run once on mount; do not re-run on prop identity changes
  }, []);

  // Key value obj with ex name key and weights and reps arrays, etsid, notes
  const [workoutProgressObj, setWorkoutProgressObj] = useState(() => {
    if (resumedWorkout) return resumedWorkout.workout;
    return exercisesForSelectedSplit.reduce((acc, ex) => {
      acc[ex.exercise] = { etsid: ex.id, weight: [], reps: [], notes: null };
      return acc;
    }, {});
  });

  useEffect(
    () => console.log(/*JSON.stringify(workoutProgressObj, null, 2)*/),
    [workoutProgressObj]
  );

  // --------------------[ Set workout mode ]--------------------------------------
  useFocusEffect(
    useCallback(() => {
      setIsWorkoutMode(true);

      return () => {
        setIsWorkoutMode(false);
      };
    }, [])
  );

  // --------------------[ Add progress + Caching]-----------------------------------------

  const saveToCache = useCallback(async () => {
    await cacheSetJSON(
      cacheKey,
      {
        selectedSplit,
        workout: workoutProgressObj,
        startTime,
        lastPause: Date.now(),
        pausedTotal,
      },
      TTL_36H
    );
  }, [cacheKey, selectedSplit, workoutProgressObj, startTime, pausedTotal]);

  const timeoutRef = useRef(null);
  // Debounce caching 5 secs
  useEffect(() => {
    (async () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        saveToCache();
      }, 5000);
    })();

    return () => clearTimeout(timeoutRef.current);
  }, [workoutProgressObj, pausedTotal, saveToCache]);

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
    //cacheDeleteKey(cacheKey);
    if (exercisesForSelectedSplit && exercisesForSelectedSplit.length) {
      addWeightRecord("Incline Bench Press", 0, 10);
      addWeightRecord("Incline Bench Press", 2, 30);
      addWeightRecord("Incline Bench Press", 1, 20.5);
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
