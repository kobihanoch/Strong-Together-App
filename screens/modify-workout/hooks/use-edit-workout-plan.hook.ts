import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import type { Exercise } from '../../../features/workouts/plan/types/workout-plan.types';
import { useWorkoutPlan } from '../../../features/workouts/plan/hooks/use-workout-plan.hook';
import { initialEditorState, workoutEditorReducer, type WorkoutData } from '../reducers/workout-editor.reducer';
import useExercises from '../../../features/workouts/plan/hooks/use-exercises.hook';
import { showErrorAlert } from '../../../shared/alerts/error-alerts';

const MAX_SPLITS = 6;
const MAX_EXERCISES = 12;

const useEditWorkoutPlan = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme, mode: themeMode } = useAppTheme();
  const {
    data: { workoutPlan },
    loadingStates: workoutPlanLoadingStates,
    actions: { updateWorkoutPlan },
  } = useWorkoutPlan();
  const { exercises: availableExercises, loading: exercisesLoading } = useExercises();

  // The reducer owns all related plan-editing state.
  const [editor, dispatch] = useReducer(workoutEditorReducer, initialEditorState);
  const { splits, selectedSplitIndex, expandedExerciseId, isDirty } = editor;
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const initialized = useRef(false);
  const isSavingRef = useRef(false);

  // Existing splits keep their backend ID. The initial new split has no ID.
  useEffect(() => {
    if (initialized.current || workoutPlanLoadingStates.isPending) return;
    const fetched: WorkoutData = (workoutPlan?.workoutSplits ?? []).map((split) => ({
      id: split.id,
      name: split.name,
      orderIndex: split.orderIndex,
      exercises: split.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        sets: exercise.sets.map((set) => set.reps),
        orderIndex: exercise.orderIndex,
      })),
    }));
    dispatch({ type: 'initialize', splits: fetched.length ? fetched : [{ name: 'Split A', orderIndex: 0, exercises: [] }] });
    initialized.current = true;
  }, [workoutPlan, workoutPlanLoadingStates.isPending]);

  const selectedSplit = splits[selectedSplitIndex] ?? null;

  // Display-only exercise metadata is looked up separately from the request body.
  const allExercises = useMemo<Exercise[]>(
    () =>
      Object.entries(availableExercises).flatMap(([targetMuscle, exercises]) =>
        exercises.map((exercise) => ({ ...exercise, targetMuscle })),
      ),
    [availableExercises],
  );
  const exercisesById = useMemo(() => new Map(allExercises.map((exercise) => [exercise.id, exercise])), [allExercises]);
  const muscles = useMemo(() => ['All', ...Object.keys(availableExercises)], [availableExercises]);
  const filteredExercises = useMemo(() => {
    const query = exerciseQuery.trim().toLowerCase();
    return allExercises.filter(
      (exercise) =>
        (selectedMuscle === 'All' || exercise.targetMuscle === selectedMuscle) && (!query || exercise.name.toLowerCase().includes(query)),
    );
  }, [allExercises, exerciseQuery, selectedMuscle]);

  const addSplit = useCallback(() => {
    if (splits.length >= MAX_SPLITS) return showErrorAlert('Error', 'Max count of splits reached.');
    dispatch({ type: 'addSplit' });
  }, [splits.length]);

  const removeSelectedSplit = useCallback(() => {
    if (splits.length === 1) return;
    dispatch({ type: 'removeSplit' });
  }, [splits.length]);

  const addExercise = useCallback(
    (exercise: Exercise) => {
      if (
        !selectedSplit ||
        selectedSplit.exercises.length >= MAX_EXERCISES ||
        selectedSplit.exercises.some((item) => item.exerciseId === exercise.id)
      )
        return showErrorAlert('Error', 'Max exercises reached.');
      dispatch({ type: 'addExercise', exerciseId: exercise.id });
    },
    [selectedSplit],
  );

  const save = useCallback(async () => {
    if (isSavingRef.current) return;

    const invalidIndex = splits.findIndex((split) => !split.name.trim() || split.exercises.length === 0);
    if (invalidIndex >= 0) {
      dispatch({ type: 'selectSplit', index: invalidIndex });
      Alert.alert(
        'Plan is incomplete',
        splits[invalidIndex].name.trim() ? 'Add at least one exercise to this split.' : 'Give this split a name.',
      );
      return;
    }

    isSavingRef.current = true;
    try {
      await updateWorkoutPlan(splits satisfies WorkoutData);
      dispatch({ type: 'markSaved' });
      navigation.replace('MyWorkoutPlan');
    } finally {
      isSavingRef.current = false;
    }
  }, [navigation, splits, updateWorkoutPlan]);

  const cancel = useCallback(() => {
    if (!isDirty) return navigation.goBack();
    Alert.alert('Discard changes?', 'Your workout plan has unsaved changes.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  }, [isDirty, navigation]);

  useEffect(() => {
    if (!isDirty) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      cancel();
      return true;
    });
    return () => subscription.remove();
  }, [cancel, isDirty]);

  return {
    data: {
      theme,
      isCreateMode: !workoutPlan,
      isLoading: workoutPlanLoadingStates.isPending || !initialized.current,
      exercisesLoading,
      themeMode,
      isSaving: isSavingRef.current || workoutPlanLoadingStates.isUpdating,
      isDirty,
      splits,
      selectedSplit,
      selectedSplitIndex,
      expandedExerciseId,
      exercisesById,
      filteredExercises,
      muscles,
      selectedMuscle,
      exerciseQuery,
    },
    actions: {
      selectSplit: (index: number) => {
        dispatch({ type: 'selectSplit', index });
      },
      addSplit,
      renameSplit: (name: string) => dispatch({ type: 'renameSplit', name }),
      removeSelectedSplit,
      toggleExercise: (exerciseId: number) => dispatch({ type: 'toggleExercise', exerciseId }),
      addExercise,
      removeExercise: (exerciseId: number) => dispatch({ type: 'removeExercise', exerciseId }),
      reorderExercises: (exercises: WorkoutData[number]['exercises']) => dispatch({ type: 'reorderExercises', exercises }),
      updateSetCount: (exerciseId: number, count: number) => dispatch({ type: 'updateSetCount', exerciseId, count }),
      updateRep: (exerciseId: number, setIndex: number, reps: number) => dispatch({ type: 'updateRep', exerciseId, setIndex, reps }),
      setExerciseQuery,
      setSelectedMuscle,
      save,
      cancel,
    },
  };
};

export default useEditWorkoutPlan;
