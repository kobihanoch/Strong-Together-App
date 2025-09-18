import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "react-native-alert-notification";
import { useWorkoutContext } from "../../context/WorkoutContext";
import { addWorkout } from "../../services/WorkoutService";
import {
  addExerciseLogic,
  addSplitLogic,
  onDragEndLogic,
  removeExerciseLogic,
  removeSplitLogic,
  updateSetsLogic,
} from "../../utils/createWorkoutUtils";
import useExercises from "../useExercises";

const useCreateWorkoutLogic = () => {
  // ----------------------------Workout and Analysis contexes----------------------------
  const { setWorkout, setWorkoutForEdit, workoutForEdit } =
    useWorkoutContext() || {};
  const hasWorkout = !!workoutForEdit;

  // ----------------------------Navigation----------------------------
  const navigation = useNavigation();

  // ----------------------------Saving----------------------------
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------Editing----------------------------
  // Keep a map: { splitName: [...Exercises] }
  const [selectedExercises, setSelectedExercises] = useState({ A: [] });
  // Update dynamiclly if there is a workout
  useEffect(() => {
    if (hasWorkout)
      setSelectedExercises(JSON.parse(JSON.stringify(workoutForEdit)));
  }, [hasWorkout, workoutForEdit]);
  const splitsList = Object.keys(selectedExercises);

  // ----------------------------Exercises in DB----------------------------
  const { exercises: availableExercises, loading: exLoading } = useExercises();

  // ---------------------------- Controls ----------------------------------
  const addExercise = useCallback((splitName, exercise) => {
    setSelectedExercises((prev) => addExerciseLogic(prev, splitName, exercise));
  }, []);

  const removeExercise = useCallback((splitName, exercise) => {
    setSelectedExercises((prev) =>
      removeExerciseLogic(prev, splitName, exercise)
    );
  }, []);

  const updateSets = useCallback((splitName, exercise, updatedSetsArr) => {
    setSelectedExercises((prev) =>
      updateSetsLogic(prev, splitName, exercise, updatedSetsArr)
    );
  }, []);

  const onDragEnd = useCallback(
    (splitName) =>
      ({ data }) => {
        setSelectedExercises((prev) => onDragEndLogic(prev, splitName, data));
      },
    []
  );

  const removeSplit = useCallback((splitName) => {
    setSelectedExercises((prev) => removeSplitLogic(prev, splitName));
  }, []);

  const addSplit = useCallback(() => {
    setSelectedExercises((prev) => addSplitLogic(prev));
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
        type: "WARNING",
        title: "Workout is incomplete",
        textBody:
          "Each split must include at least one exercise. Add exercises or remove empty splits before saving.",
        button: "OK",
        autoClose: true,
        onPressButton: () => Dialog.hide(),
        onTouchOutside: () => Dialog.hide(),
      });
      return;
    }

    // Passed validation -> proceed to save
    setIsSaving(true);
    console.log("[Create Workout]: Started saving...");

    (async () => {
      try {
        const data = await addWorkout(map);
        setWorkout(data.workoutPlan);
        setWorkoutForEdit(data.workoutPlanForEditWorkout);
        navigation.navigate("MyWorkoutPlan");
      } catch (e) {
        console.log(`[Create Workout]: ${e}`);
      } finally {
        saveLock.current = false;
        setIsSaving(false);
        console.log("[Create Workout]: Workout saved susccessfuly");
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
    [addExercise, addSplit, updateSets, removeExercise, removeSplit, onDragEnd]
  );

  const loadings = useMemo(
    () => ({
      isSaving,
      exLoading,
    }),
    [isSaving, exLoading]
  );

  return {
    selectedExercises,
    splitsList,
    availableExercises,
    saveWorkout,
    controls,
    loadings,
  };
};

export default useCreateWorkoutLogic;
