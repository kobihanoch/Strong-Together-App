import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { Exercise } from '../../shared/types/workout.types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { keyStartWorkout } from '../../../../infrastructure/cache/cache-keys.utils';
import { cacheDeleteKey } from '../../../../infrastructure/cache/cache.constants';
import { RootParamList } from '../../../../navigation/types/appStackTypes';
import { showErrorAlert } from '../../../../shared/alerts/error-alerts';
import { useAuth } from '../../../auth/shared/providers/AuthProvider';
import { WorkoutSplit } from '../../shared/types/workout.types';
import { useWorkoutHistory } from '../../shared/providers/WorkoutHistoryProvider';
import { useWorkoutPlan } from '../../shared/providers/WorkoutPlanProvider';
import { ExercisesDuringWorkout, ResumeWorkoutCachePayload, StartWorkoutPageLogicReturn } from '../types/use-start-workout.types';
import { applyNotes, applyReps, applyWeight, countSetsDone, createArrayForDataBase } from '../utils/start-workout.util';
import { useStartWorkoutCache } from './use-start-workout-cache.hook';
import { useUserWorkout } from './use-user-workout.hook';

const useStartWorkoutPageLogic = (
  selectedSplit: WorkoutSplit,
  resumedWorkout?: Omit<ResumeWorkoutCachePayload, 'selectedSplit'>,
): StartWorkoutPageLogicReturn => {
  // --------------------[ Navigation ]--------------------------------------
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  // --------------------[ Context ]--------------------------------------
  const { setIsWorkoutMode, userIdCache } = useAuth();
  const { exercises = {} } = useWorkoutPlan() || {};
  const { updateWorkoutHistory } = useWorkoutHistory();

  // --------------------[ Set workout mode ]--------------------------------------
  useFocusEffect(
    useCallback(() => {
      setIsWorkoutMode(true);
      return () => {
        setIsWorkoutMode(false);
      };
    }, []),
  );

  // --------------------[ Exercises and Workout Name ]------------------------------------------
  // Set exercises array for selected split
  const exercisesForSelectedSplit = useMemo(() => {
    return exercises[selectedSplit.name] || [];
  }, [exercises, selectedSplit]);

  // Always an array
  const totalSets = exercisesForSelectedSplit.reduce((sum, ex) => {
    sum += ex.sets!.length;
    return sum;
  }, 0);

  const workoutName = selectedSplit?.name;

  // --------------------[ Progress object ]--------------------------------------
  // Key value obj with ex name key and weights and reps arrays, etsid, notes
  const [workoutProgressObj, setWorkoutProgressObj] = useState<ExercisesDuringWorkout>((): ExercisesDuringWorkout => {
    if (resumedWorkout) return resumedWorkout.workout;
    return exercisesForSelectedSplit.reduce((acc: ExercisesDuringWorkout, ex) => {
      acc[ex.exercise!] = { etsid: ex.id, weight: [], reps: [], notes: null };
      return acc;
    }, {});
  });

  /*useEffect(() => {
    console.log(JSON.stringify(workoutProgressObj, null, 2));
  }, [workoutProgressObj]);*/

  // --------------------[ Timer + Caching ]----------------------
  const { cacheKey, startTime, pausedTotal, disableCache } = useStartWorkoutCache(
    userIdCache!, // Save cache with user id from cache for better offline experience
    selectedSplit,
    resumedWorkout,
    workoutProgressObj,
  );

  // Count only after both fields has updated and count
  // Count only until planned sets by original workout plan
  const { sum: setsDone = 0, byExercise: setsDoneWithExerciseNameKey = {} } = useMemo(
    () => countSetsDone(workoutProgressObj, exercisesForSelectedSplit),
    [workoutProgressObj, exercisesForSelectedSplit],
  );

  // --------------------[ Add progress ]-----------------------------------------
  const addWeightRecord = useCallback((exerciseName: Exercise['name'], setIndex: number, weight: number): void => {
    setWorkoutProgressObj((prev) => applyWeight(prev, exerciseName, setIndex, weight));
  }, []);

  const addRepsRecord = useCallback((exerciseName: Exercise['name'], setIndex: number, reps: number) => {
    setWorkoutProgressObj((prev) => applyReps(prev, exerciseName, setIndex, reps));
  }, []);

  const addNotes = useCallback((exerciseName: Exercise['name'], notes: string | null) => {
    setWorkoutProgressObj((prev) => applyNotes(prev, exerciseName, notes));
  }, []);

  // --------------------[ Save Workout ]-----------------------------------------
  const clearCache = useCallback(async () => {
    await cacheDeleteKey(keyStartWorkout(userIdCache!));
  }, [cacheKey]);

  const onExit = async () => {
    await clearCache();
    // Force unmounting
    navigation.replace('MyWorkoutPlan');
  };

  const { saveWorkoutProcess } = useUserWorkout();
  const [saveStarted, setSaveStarted] = useState(false);
  const saveLock = useRef(false);

  const saveData = useCallback(async () => {
    if (saveLock.current) return;
    saveLock.current = true;
    setSaveStarted(true);
    console.log('Saving started!');
    try {
      // Trims zeros in array and creates an array of rows object as database requires
      const arr = createArrayForDataBase(workoutProgressObj);
      if (!arr.length) {
        showErrorAlert('Saving Error', 'Please perform at least one set');
        return;
      }

      const exerciseTrackingMaps = await saveWorkoutProcess(arr, startTime, Date.now());

      // Update shared state and persistent cache with the mutation response.
      await updateWorkoutHistory(exerciseTrackingMaps);
      setIsWorkoutMode(false);
      disableCache();
      await clearCache();
      navigation.replace('Statistics');
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
