import type { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useExerciseHistory } from '../../../features/workouts/history/hooks/use-exercise-history.hook';
import { usePrHistory } from '../../../features/workouts/history/hooks/use-pr-history.hook';
import type { WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';
import useExercises from '../../../features/workouts/plan/hooks/use-exercises.hook';
import type { Exercise } from '../../../features/workouts/plan/types/exercises.types';
import { useWorkoutSession } from '../../../features/workouts/session/hooks/use-workout-session.hook';
import type { RootParamList } from '../../../navigation/types/appStackTypes';
import { showErrorAlert } from '../../../shared/alerts/error-alerts';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import { getTopSet, includePersonalRecordPoint, type TrackHistoryPoint } from '../../track-history/utils/track-history.utils';
import {
  buildNavigatorExercises,
  createWorkoutEntries,
  filterExercises,
  findNextIncompleteSetIndex,
  flattenExercises,
  getExerciseKey,
  getPlannedWorkoutProgress,
  getTotalSets,
  isExerciseAlreadyAdded,
  type TrackedSet,
} from '../utils/workout-session-screen.utils';

/** Connects the Workout Session screen to the persisted session feature. */
const useWorkoutSessionScreen = (workoutSplit: WorkoutSplit, navigation: StackNavigationProp<RootParamList, 'WorkoutSession'>) => {
  const { colors: theme, mode: themeMode } = useAppTheme();
  const { actions, data, loadingStates } = useWorkoutSession();
  const { startWorkout, discardWorkout } = actions;
  const { data: history } = useExerciseHistory();
  const { data: personalRecords } = usePrHistory();
  const { data: exerciseCollection, loadingStates: exerciseLoading } = useExercises();
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const initializedSession = useRef(Boolean(data.draft));
  const { activeExerciseIndex: exerciseIndex, activeSetIndex: setIndex, completedSetKeys, rest } = data.progress;

  useEffect(() => {
    if (initializedSession.current || data.draft || !workoutSplit.exercises.length) return;
    initializedSession.current = true;
    startWorkout(createWorkoutEntries(workoutSplit), workoutSplit);
  }, [data.draft, startWorkout, workoutSplit]);

  const draftExercise = data.draft?.workout[exerciseIndex] ?? null;
  const planExercise = workoutSplit.exercises.find((exercise) => exercise.exerciseToSplitId === draftExercise?.exerciseToSplitId);
  const activeSet = draftExercise?.trackedSets[setIndex] ?? null;
  const isActiveExerciseAdded = Boolean(draftExercise && !draftExercise.isExerciseAssignedToSplit);
  const previousSet = history.getLastPerformanceForExercise(planExercise?.exerciseToSplitId ?? null)?.performance?.[setIndex] ?? null;
  const exerciseHistory = history.getExerciseHistoryData(planExercise?.exerciseToSplitId ?? null);
  const exerciseKey = getExerciseKey(draftExercise, exerciseIndex);
  const setKey = `${exerciseKey}:${activeSet?.setIndex ?? setIndex}`;
  const isActiveSetCompleted = completedSetKeys.includes(setKey);
  const canCompleteActiveSet = Boolean(activeSet && !isActiveSetCompleted && activeSet.weight > 0 && activeSet.reps > 0);
  const lastSet = draftExercise?.trackedSets.at(-1);
  const canAddExtraSet = Boolean(
    !isActiveExerciseAdded && lastSet && completedSetKeys.includes(`${exerciseKey}:${lastSet.setIndex}`),
  );

  const workout = data.draft?.workout ?? [];
  const totalSets = getTotalSets(workout);
  const completedCount = completedSetKeys.length;
  const plannedProgress = getPlannedWorkoutProgress(workout, workoutSplit, completedSetKeys);
  const completionSetCount = isActiveExerciseAdded ? (draftExercise?.trackedSets.length ?? 0) : (planExercise?.sets.length ?? 0);
  const plannedSets = draftExercise?.trackedSets.slice(0, completionSetCount) ?? [];
  const isActiveExerciseComplete = Boolean(
    activeSet &&
    completedSetKeys.includes(setKey) &&
    plannedSets.length &&
    plannedSets.every((set) => completedSetKeys.includes(`${exerciseKey}:${set.setIndex}`)),
  );
  const isPlannedWorkoutComplete = plannedProgress.total > 0 && plannedProgress.completed === plannedProgress.total;
  const allExercises = useMemo(() => flattenExercises(exerciseCollection), [exerciseCollection]);
  const exercisesById = useMemo(() => new Map(allExercises.map((exercise) => [exercise.id, exercise])), [allExercises]);
  const muscles = useMemo(() => (exerciseCollection ? ['All', ...Object.keys(exerciseCollection)] : ['All']), [exerciseCollection]);
  const filteredExercises = useMemo(
    () => filterExercises(allExercises, selectedMuscle, exerciseQuery),
    [allExercises, exerciseQuery, selectedMuscle],
  );
  const navigatorExercises = buildNavigatorExercises(workout, workoutSplit, exercisesById, completedSetKeys);
  const personalRecord = planExercise ? personalRecords.getPrForExerciseId(planExercise.exerciseId) : null;
  const activeExerciseName = planExercise?.name ?? exercisesById.get(draftExercise?.exerciseId ?? -1)?.name ?? 'Exercise';
  const recentHistoryPoints = exerciseHistory
    .slice(0, 5)
    .reverse()
    .map<TrackHistoryPoint>((entry) => ({
      date: entry.workoutStartLocal,
      ...getTopSet(entry.sets),
    }));
  const historyPoints = includePersonalRecordPoint(
    recentHistoryPoints,
    exerciseHistory,
    personalRecord,
    !isActiveExerciseComplete,
  );

  const selectExercise = (nextIndex: number): void => {
    const count = data.draft?.workout.length ?? 0;
    if (!count) return;
    actions.setActiveExercise((nextIndex + count) % count);
  };

  const updateValue = (field: 'weight' | 'reps', value: number): void => {
    if (!activeSet) return;
    actions.updateSet(exerciseIndex, { ...activeSet, [field]: Math.max(0, value) });
  };

  const completeSet = (): void => {
    if (!activeSet || !canCompleteActiveSet) return;

    actions.completeSet(setKey, activeExerciseName);

    const nextSetIndex = findNextIncompleteSetIndex(draftExercise?.trackedSets ?? [], setIndex, exerciseKey, completedSetKeys);
    if (nextSetIndex >= 0) actions.setActiveSet(nextSetIndex);
  };

  const addSet = (): void => {
    if (!draftExercise || !canAddExtraSet) return;
    actions.addSet(exerciseIndex, {
      setIndex: (lastSet?.setIndex ?? -1) + 1,
      reps: 0,
      weight: 0,
    });
    actions.setActiveSet(draftExercise.trackedSets.length);
  };

  const removeSet = (trackedSetIndex: TrackedSet['setIndex']): void => {
    if (!draftExercise || draftExercise.trackedSets.length <= (planExercise?.sets.length ?? 0)) return;
    actions.removeSet(exerciseIndex, trackedSetIndex, `${exerciseKey}:${trackedSetIndex}`);
    if (setIndex >= draftExercise.trackedSets.length - 1) actions.setActiveSet(Math.max(0, setIndex - 1));
  };

  const addExercise = (exercise: Exercise): void => {
    if (data.draft?.workout.some((item) => item.exerciseId === exercise.id)) return;
    const nextIndex = data.draft?.workout.length ?? 0;
    actions.addExercise(exercise.id);
    actions.setActiveExercise(nextIndex);
  };

  const fillFromHistory = (sets: (typeof exerciseHistory)[number]['sets']): void => {
    draftExercise?.trackedSets.forEach((set, index) => {
      const previous = sets[index];
      const isCompleted = completedSetKeys.includes(`${exerciseKey}:${set.setIndex}`);
      if (previous && !isCompleted) actions.updateSet(exerciseIndex, { ...set, weight: previous.weight, reps: previous.reps });
    });
  };

  /** Opens the first unfinished set in the next unfinished exercise. */
  const selectNextIncompleteExercise = (): void => {
    if (!workout.length) return;
    for (let offset = 1; offset <= workout.length; offset += 1) {
      const nextExerciseIndex = (exerciseIndex + offset) % workout.length;
      const nextExercise = workout[nextExerciseIndex];
      if (!nextExercise) continue;
      const nextExerciseKey = getExerciseKey(nextExercise, nextExerciseIndex);
      const nextSetIndex = nextExercise.trackedSets.findIndex((set) => !completedSetKeys.includes(`${nextExerciseKey}:${set.setIndex}`));
      if (nextSetIndex < 0) continue;
      actions.setActiveExercise(nextExerciseIndex);
      actions.setActiveSet(nextSetIndex);
      return;
    }
  };

  /** Submits the normalized workout and leaves only after server success. */
  const submitWorkout = async (): Promise<void> => {
    const submitted = await actions.saveWorkout();
    const startedAt = Date.parse(submitted.workoutStartUtc);
    const endedAt = Date.parse(submitted.workoutEndUtc!);
    let extraSets = 0;
    const exercises = submitted.workout.map((exercise) => {
      const planned = workoutSplit.exercises.find((item) => item.exerciseToSplitId === exercise.exerciseToSplitId);
      if (planned) extraSets += exercise.trackedSets.filter((set) => set.setIndex >= planned.sets.length).length;
      return {
        exerciseId: exercise.exerciseId ?? planned?.exerciseId ?? 0,
        name: planned?.name ?? exercisesById.get(exercise.exerciseId ?? -1)?.name ?? 'Added exercise',
        sets: exercise.trackedSets.map(({ weight, reps }) => ({ weight, reps })),
      };
    });

    navigation.replace('WorkoutSummary', {
      workoutName: workoutSplit.name,
      durationSeconds: Math.max(0, Math.round((endedAt - startedAt) / 1000)),
      completedSets: submitted.workout.reduce((count, exercise) => count + exercise.trackedSets.length, 0),
      extraSets,
      exercises,
    });
  };

  /** Validates and confirms finishing complete and incomplete workouts. */
  const finishWorkout = (): void => {
    if (loadingStates.isSaving) return;
    if (!completedCount) {
      showErrorAlert('Workout is not ready', 'Complete at least one set before finishing the workout.');
      return;
    }

    const isIncomplete = completedCount < totalSets;
    Alert.alert(
      isIncomplete ? 'Finish incomplete workout?' : 'Finish workout?',
      isIncomplete
        ? `${totalSets - completedCount} sets are still unfinished. Are you sure you want to finish?`
        : 'Are you sure you have finished this workout?',
      [
        { text: 'Keep working', style: 'cancel' },
        { text: 'Finish workout', onPress: () => void submitWorkout() },
      ],
    );
  };

  /** Confirms leaving and clears the persisted draft when explicitly discarded. */
  const exitWorkout = (): void => {
    Alert.alert('Exit workout?', 'Your workout draft will be deleted.', [
      { text: 'Keep working', style: 'cancel' },
      {
        text: 'Exit without saving',
        style: 'destructive',
        onPress: async () => {
          navigation.replace('Home');
          await discardWorkout();
        },
      },
    ]);
  };

  /** Confirms removal of an exercise added during this workout. */
  const removeActiveExercise = (): void => {
    Alert.alert('Remove added exercise?', 'Its entered sets and progress will be deleted from this workout.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove exercise',
        style: 'destructive',
        onPress: () => {
          if (draftExercise?.exerciseId) actions.removeExercise(draftExercise.exerciseId);
        },
      },
    ]);
  };

  return {
    data: {
      theme,
      themeMode,
      workoutName: workoutSplit.name,
      workoutStartedAtUtc: data.draft?.workoutStartUtc ?? null,
      exerciseName: activeExerciseName,
      exerciseIndex,
      exerciseKey: String(exerciseKey),
      exerciseCount: data.draft?.workout.length ?? workoutSplit.exercises.length,
      setIndex,
      sets: draftExercise?.trackedSets ?? [],
      plannedSetCount: isActiveExerciseAdded ? (draftExercise?.trackedSets.length ?? 0) : (planExercise?.sets.length ?? 0),
      isActiveSetExtra: !isActiveExerciseAdded && setIndex >= (planExercise?.sets.length ?? 0),
      isActiveExerciseAdded,
      activeSet,
      isActiveSetCompleted,
      canCompleteActiveSet,
      canAddExtraSet,
      previousSet,
      completedSetKeys,
      completedCount,
      totalSets,
      plannedProgress,
      isActiveExerciseComplete,
      isPlannedWorkoutComplete,
      rest,
      navigatorExercises,
      exerciseHistory,
      historyPoints,
      exercisePicker: {
        exercises: filteredExercises,
        muscles,
        selectedMuscle,
        query: exerciseQuery,
        isLoading: exerciseLoading.isPending,
        isAdded: (exercise: Exercise) => Boolean(isExerciseAlreadyAdded(exercise, workout, workoutSplit)),
      },
      isSaving: loadingStates.isSaving,
    },
    actions: {
      previousExercise: () => selectExercise(exerciseIndex - 1),
      nextExercise: () => selectExercise(exerciseIndex + 1),
      selectExercise,
      reorderExercises: actions.reorderExercises,
      addExercise,
      setExerciseQuery,
      setSelectedMuscle,
      fillFromHistory,
      selectSet: actions.setActiveSet,
      addSet,
      removeSet,
      removeActiveSet: () => activeSet && removeSet(activeSet.setIndex),
      removeActiveExercise: () => {
        removeActiveExercise();
      },
      updateWeight: (value: number) => updateValue('weight', value),
      updateReps: (value: number) => updateValue('reps', value),
      completeSet,
      selectNextIncompleteExercise,
      finishRest: actions.finishRest,
      finishWorkout,
      exitWorkout,
    },
  };
};

export type WorkoutSessionScreenData = ReturnType<typeof useWorkoutSessionScreen>['data'];
export type WorkoutSessionScreenActions = ReturnType<typeof useWorkoutSessionScreen>['actions'];

export default useWorkoutSessionScreen;
