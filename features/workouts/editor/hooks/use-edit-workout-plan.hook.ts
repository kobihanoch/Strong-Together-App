import type { AddWorkoutBody } from '@strong-together/shared';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import { RootParamList } from '../../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../../shared/providers/AppThemeProvider';
import type { Exercise } from '../../plan/types/workout-plan.types';
import { useWorkoutPlan } from '../../plan/hooks/use-workout-plan.hook';
import useExercises from './use-exercises.hook';
import { showErrorAlert } from '../../../../shared/alerts/error-alerts';

type WorkoutData = AddWorkoutBody['workoutData'];
const MAX_SPLITS = 6;
const MAX_EXERCISES = 12;

const useEditWorkoutPlan = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme, mode: themeMode } = useAppTheme();
  const {
    data: { workoutPlan },
    loadingStates: { isLoading: planLoading },
    actions: { updateWorkoutPlan },
  } = useWorkoutPlan();
  const { exercises: availableExercises, loading: exercisesLoading } = useExercises();

  // Keep editor state identical to the workoutData body accepted by POST /add.
  const [splits, setSplits] = useState<WorkoutData>([]);
  const [selectedSplitIndex, setSelectedSplitIndex] = useState(0);
  const [expandedExerciseId, setExpandedExerciseId] = useState<number | null>(null);
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialized = useRef(false);

  // Existing splits keep their backend ID. The initial new split has no ID.
  useEffect(() => {
    if (initialized.current || planLoading) return;
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
    setSplits(fetched.length ? fetched : [{ name: 'Split A', orderIndex: 0, exercises: [] }]);
    initialized.current = true;
  }, [planLoading, workoutPlan]);

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

  const updateSelectedSplit = useCallback(
    (update: (split: WorkoutData[number]) => WorkoutData[number]) => {
      setSplits((current) => current.map((split, index) => (index === selectedSplitIndex ? update(split) : split)));
      setIsDirty(true);
    },
    [selectedSplitIndex],
  );

  const addSplit = useCallback(() => {
    if (splits.length >= MAX_SPLITS) return showErrorAlert('Error', 'Max count of splits reached.');
    setSplits((current) => [
      ...current,
      {
        name: `Split ${String.fromCharCode(65 + current.length)}`,
        orderIndex: current.length,
        exercises: [],
      },
    ]);
    setSelectedSplitIndex(splits.length);
    setExpandedExerciseId(null);
    setIsDirty(true);
  }, [splits.length]);

  const removeSelectedSplit = useCallback(() => {
    if (splits.length === 1) return;
    setSplits((current) =>
      current.filter((_, index) => index !== selectedSplitIndex).map((split, orderIndex) => ({ ...split, orderIndex })),
    );
    setSelectedSplitIndex((index) => Math.max(0, Math.min(index, splits.length - 2)));
    setExpandedExerciseId(null);
    setIsDirty(true);
  }, [selectedSplitIndex, splits.length]);

  const addExercise = useCallback(
    (exercise: Exercise) => {
      if (
        !selectedSplit ||
        selectedSplit.exercises.length >= MAX_EXERCISES ||
        selectedSplit.exercises.some((item) => item.exerciseId === exercise.id)
      )
        return showErrorAlert('Error', 'Max exercises reached.');
      updateSelectedSplit((split) => ({
        ...split,
        exercises: [
          ...split.exercises,
          {
            exerciseId: exercise.id,
            sets: [10, 10, 10],
            orderIndex: split.exercises.length,
          },
        ],
      }));
      setExpandedExerciseId(exercise.id);
    },
    [selectedSplit, updateSelectedSplit],
  );

  const removeExercise = useCallback(
    (exerciseId: number) => {
      updateSelectedSplit((split) => ({
        ...split,
        exercises: split.exercises
          .filter((exercise) => exercise.exerciseId !== exerciseId)
          .map((exercise, orderIndex) => ({ ...exercise, orderIndex })),
      }));
      setExpandedExerciseId(null);
    },
    [updateSelectedSplit],
  );

  const updateSetCount = useCallback(
    (exerciseId: number, count: number) =>
      updateSelectedSplit((split) => ({
        ...split,
        exercises: split.exercises.map((exercise) => {
          if (exercise.exerciseId !== exerciseId) return exercise;
          const sets = [...exercise.sets];
          while (sets.length < count) sets.push(sets.at(-1) ?? 10);
          return { ...exercise, sets: sets.slice(0, count) };
        }),
      })),
    [updateSelectedSplit],
  );

  const updateRep = useCallback(
    (exerciseId: number, setIndex: number, reps: number) =>
      updateSelectedSplit((split) => ({
        ...split,
        exercises: split.exercises.map((exercise) =>
          exercise.exerciseId === exerciseId
            ? { ...exercise, sets: exercise.sets.map((value, index) => (index === setIndex ? Math.max(1, reps) : value)) }
            : exercise,
        ),
      })),
    [updateSelectedSplit],
  );

  const save = useCallback(async () => {
    const invalidIndex = splits.findIndex((split) => !split.name.trim() || split.exercises.length === 0);
    if (invalidIndex >= 0) {
      setSelectedSplitIndex(invalidIndex);
      Alert.alert(
        'Plan is incomplete',
        splits[invalidIndex].name.trim() ? 'Add at least one exercise to this split.' : 'Give this split a name.',
      );
      return;
    }
    setIsSaving(true);
    try {
      const workoutData: WorkoutData = splits.map((split, orderIndex) => ({
        ...(split.id === undefined ? {} : { id: split.id }),
        name: split.name.trim(),
        orderIndex,
        exercises: split.exercises.map((exercise, exerciseIndex) => ({ ...exercise, orderIndex: exerciseIndex })),
      }));
      await updateWorkoutPlan(workoutData);
      setIsDirty(false);
      navigation.replace('MyWorkoutPlan');
    } finally {
      setIsSaving(false);
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
      isLoading: planLoading || !initialized.current,
      exercisesLoading,
      themeMode,
      isSaving,
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
        setSelectedSplitIndex(index);
        setExpandedExerciseId(null);
      },
      addSplit,
      renameSplit: (name: string) => updateSelectedSplit((split) => ({ ...split, name })),
      removeSelectedSplit,
      toggleExercise: (id: number) => setExpandedExerciseId((current) => (current === id ? null : id)),
      addExercise,
      removeExercise,
      reorderExercises: (data: WorkoutData[number]['exercises']) =>
        updateSelectedSplit((split) => ({
          ...split,
          exercises: data.map((exercise, orderIndex) => ({ ...exercise, orderIndex })),
        })),
      updateSetCount,
      updateRep,
      setExerciseQuery,
      setSelectedMuscle,
      save,
      cancel,
    },
  };
};

export default useEditWorkoutPlan;
