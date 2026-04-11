import { SelectedExercise } from './../types/use-create-workout.types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useWorkoutPlanContext } from '../../shared/providers/WorkoutPlanProvider';
import { RootParamList } from '../../../../navigation/types/appStackTypes';
import { addWorkout } from '../services/workout-editor.service';
import { WorkoutSplitEntity } from '@strong-together/shared';
import {
  addExerciseLogic,
  addSplitLogic,
  getExercisesCountMap,
  onDragEndLogic,
  removeExerciseLogic,
  removeSplitLogic,
  updateSetsLogic,
} from '../utils/create-workout.util';
import { ExerciseCandidate, SelectedExercises } from '../types/use-create-workout.types';
import useExercises from './use-exercises.hook';
import { ExerciseToWorkoutSplitEntity } from '@strong-together/shared';

const useCreateWorkoutLogic = () => {
  // ----------------------------Workout and Analysis contexes----------------------------
  const { setWorkout, setWorkoutForEdit, workoutForEdit } = useWorkoutPlanContext();
  const hasWorkout = !!workoutForEdit;

  // ----------------------------Navigation----------------------------
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();

  // ----------------------------Saving----------------------------
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // ----------------------------Editing----------------------------
  const [selectedSplit, setSelectedSplit] = useState<WorkoutSplitEntity['name']>('A');
  // Keep a map: { splitName: [...Exercises] }
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercises>({ A: [] });
  const exForSplit = selectedExercises[selectedSplit] || [];

  // Update dynamiclly if there is a workout
  useEffect(() => {
    if (hasWorkout) setSelectedExercises(JSON.parse(JSON.stringify(workoutForEdit)));
  }, [hasWorkout, workoutForEdit]);
  const splitsList = Object.keys(selectedExercises);

  // ----------------------------Exercises in DB----------------------------
  const { exercises: availableExercises = {}, loading: exLoading = true } = useExercises() || {};
  const allExercises = useMemo(
    () =>
      Object.entries(availableExercises)
        .map(([muscle, exercises]) => {
          return exercises.map((ex) => {
            return { ...ex, targetmuscle: muscle };
          });
        })
        .flat(),
    [availableExercises],
  );

  const muscles = useMemo(() => ['All', ...Object.keys(availableExercises)], [availableExercises]);

  // ---------------------------- Controls ----------------------------------

  const { map: exerciseCountMap, totalExercises } = getExercisesCountMap(selectedExercises);

  const addExercise = useCallback(
    (exercise: ExerciseCandidate) => {
      setSelectedExercises((prev) => addExerciseLogic(prev, selectedSplit, exercise));
    },
    [selectedSplit],
  );

  const removeExercise = useCallback(
    (exercise: SelectedExercise) => {
      setSelectedExercises((prev) => removeExerciseLogic(prev, selectedSplit, exercise));
    },
    [selectedSplit],
  );

  const updateSets = useCallback(
    (exercise: SelectedExercise, updatedSetsArr: ExerciseToWorkoutSplitEntity['sets']) => {
      setSelectedExercises((prev) => updateSetsLogic(prev, selectedSplit, exercise, updatedSetsArr));
    },
    [selectedSplit],
  );

  const onDragEnd = useCallback(
    ({ data }: { data: SelectedExercise[] }) => {
      setSelectedExercises((prev) => onDragEndLogic(prev, selectedSplit, data));
    },
    [selectedSplit],
  );

  const removeSplit = useCallback((splitName: WorkoutSplitEntity['name']) => {
    setSelectedExercises((prev) => {
      const { next, nextSelected } = removeSplitLogic(prev, splitName);
      setSelectedSplit(nextSelected);
      return next;
    });
  }, []);

  const addSplit = useCallback(() => {
    setSelectedExercises((prev) => {
      const { next, lastAdded, didAdd } = addSplitLogic(prev);
      if (didAdd) setSelectedSplit(lastAdded!); // Only when we actually added
      return next; // Always return a valid state object
    });
  }, []);

  const saveLock = useRef(false);
  const saveWorkout = async () => {
    // Validate workout: must have splits and each split must contain at least one exercise
    if (saveLock.current) return;
    saveLock.current = true;
    const map = selectedExercises || {};
    const splitKeys = Object.keys(map);

    const hasNoSplits = splitKeys.length === 0;
    const hasEmptySplit = splitKeys.some((k) => (map[k]?.length ?? 0) === 0);

    if (hasNoSplits || hasEmptySplit) {
      saveLock.current = false; // release immediately
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Workout is incomplete',
        textBody: 'Each split must include at least one exercise. Add exercises or remove empty splits before saving.',
        button: 'OK',
        autoClose: true,
        onPressButton: () => Dialog.hide(),
        //onTouchOutside: () => Dialog.hide(),
      });
      return;
    }

    // Passed validation -> proceed to save
    setIsSaving(true);
    console.log('[Create Workout]: Started saving...');
    (async () => {
      try {
        const data = await addWorkout(map);
        setWorkout(data.workoutPlan);
        setWorkoutForEdit(data.workoutPlanForEditWorkout);
        navigation.navigate('MyWorkoutPlan');
      } catch (e) {
        console.log(`[Create Workout]: ${e}`);
      } finally {
        saveLock.current = false;
        setIsSaving(false);
        console.log('[Create Workout]: Workout saved susccessfuly');
      }
    })();
  };

  const controls = useMemo(
    () => ({
      addExercise,
      addSplit,
      updateSets,
      removeExercise,
      removeSplit,
      onDragEnd,
    }),
    [addExercise, addSplit, updateSets, removeExercise, removeSplit, onDragEnd],
  );

  const loadings = useMemo(
    () => ({
      isSaving,
      exLoading,
    }),
    [isSaving, exLoading],
  );

  return {
    selectedExercises,
    splitsList,
    availableExercises, // Map
    allExercises, // Flat
    muscles,
    saveWorkout,
    controls,
    loadings,
    hasWorkout,
    setSelectedSplit,
    exerciseCountMap,
    totalExercises,
    selectedSplit,
    exForSplit,
  };
};

export default useCreateWorkoutLogic;


