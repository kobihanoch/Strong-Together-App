import { useEffect, useMemo, useState } from 'react';
import { useExerciseHistory } from '../../../features/workouts/history/hooks/use-exercise-history.hook';
import type { WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';
import useExercises from '../../../features/workouts/plan/hooks/use-exercises.hook';
import type { Exercise } from '../../../features/workouts/plan/types/exercises.types';
import { useWorkoutSession } from '../../../features/workouts/session/hooks/use-workout-session.hook';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import {
  buildNavigatorExercises,
  createWorkoutEntries,
  filterExercises,
  findNextIncompleteSetIndex,
  flattenExercises,
  getExerciseKey,
  getTotalSets,
  isExerciseAlreadyAdded,
  type TrackedSet,
} from '../utils/workout-session-screen.utils';

/** Connects the Workout Session screen to the persisted session feature. */
const useWorkoutSessionScreen = (workoutSplit: WorkoutSplit) => {
  const { colors: theme, mode: themeMode } = useAppTheme();
  const { actions, data, loadingStates } = useWorkoutSession();
  const { startWorkout, discardWorkout } = actions;
  const { data: history } = useExerciseHistory();
  const { data: exerciseCollection, loadingStates: exerciseLoading } = useExercises();
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const { activeExerciseIndex: exerciseIndex, activeSetIndex: setIndex, completedSetKeys, rest } = data.progress;

  useEffect(() => {
    if (data.draft || !workoutSplit.exercises.length) return;
    startWorkout(createWorkoutEntries(workoutSplit), workoutSplit);
  }, [data.draft, startWorkout, workoutSplit]);

  const draftExercise = data.draft?.workout[exerciseIndex] ?? null;
  const planExercise = workoutSplit.exercises.find((exercise) => exercise.exerciseToSplitId === draftExercise?.exerciseToSplitId);
  const activeSet = draftExercise?.trackedSets[setIndex] ?? null;
  const isActiveExerciseAdded = Boolean(draftExercise && !draftExercise.isExerciseAssignedToSplit);
  const previousSet = history.getLastPerformanceForExercise(planExercise?.exerciseToSplitId ?? null)?.performance?.[setIndex] ?? null;
  const exerciseKey = getExerciseKey(draftExercise, exerciseIndex);
  const setKey = `${exerciseKey}:${activeSet?.setIndex ?? setIndex}`;

  const workout = data.draft?.workout ?? [];
  const totalSets = getTotalSets(workout);
  const completedCount = completedSetKeys.length;
  const allExercises = useMemo(() => flattenExercises(exerciseCollection), [exerciseCollection]);
  const exercisesById = useMemo(() => new Map(allExercises.map((exercise) => [exercise.id, exercise])), [allExercises]);
  const muscles = useMemo(() => (exerciseCollection ? ['All', ...Object.keys(exerciseCollection)] : ['All']), [exerciseCollection]);
  const filteredExercises = useMemo(
    () => filterExercises(allExercises, selectedMuscle, exerciseQuery),
    [allExercises, exerciseQuery, selectedMuscle],
  );
  const navigatorExercises = buildNavigatorExercises(workout, workoutSplit, exercisesById, completedSetKeys);

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
    if (!activeSet) return;

    actions.completeSet(setKey, planExercise?.name ?? 'Exercise');

    const nextSetIndex = findNextIncompleteSetIndex(draftExercise?.trackedSets ?? [], setIndex, exerciseKey, completedSetKeys);
    if (nextSetIndex >= 0) actions.setActiveSet(nextSetIndex);
  };

  const addSet = (): void => {
    if (!draftExercise) return;
    const lastSet = draftExercise.trackedSets.at(-1);
    actions.addSet(exerciseIndex, {
      setIndex: (lastSet?.setIndex ?? -1) + 1,
      reps: lastSet?.reps ?? 0,
      weight: lastSet?.weight ?? 0,
    });
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

  return {
    data: {
      theme,
      themeMode,
      workoutName: workoutSplit.name,
      workoutStartedAtUtc: data.draft?.workoutStartUtc ?? null,
      exerciseName: planExercise?.name ?? 'Exercise',
      exerciseIndex,
      exerciseKey: String(exerciseKey),
      exerciseCount: data.draft?.workout.length ?? workoutSplit.exercises.length,
      setIndex,
      sets: draftExercise?.trackedSets ?? [],
      plannedSetCount: isActiveExerciseAdded ? draftExercise?.trackedSets.length ?? 0 : planExercise?.sets.length ?? 0,
      isActiveSetExtra: !isActiveExerciseAdded && setIndex >= (planExercise?.sets.length ?? 0),
      isActiveExerciseAdded,
      activeSet,
      previousSet,
      completedSetKeys,
      completedCount,
      totalSets,
      rest,
      navigatorExercises,
      exercisePicker: {
        exercises: filteredExercises,
        muscles,
        selectedMuscle,
        query: exerciseQuery,
        isLoading: exerciseLoading.isPending,
        isAdded: (exercise: Exercise) =>
          Boolean(
            isExerciseAlreadyAdded(exercise, workout, workoutSplit),
          ),
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
      selectSet: actions.setActiveSet,
      addSet,
      removeSet,
      removeActiveSet: () => activeSet && removeSet(activeSet.setIndex),
      removeActiveExercise: () => {
        if (draftExercise?.exerciseId) actions.removeExercise(draftExercise.exerciseId);
      },
      updateWeight: (value: number) => updateValue('weight', value),
      updateReps: (value: number) => updateValue('reps', value),
      completeSet,
      finishRest: actions.finishRest,
      saveWorkout: actions.saveWorkout,
      discardWorkout,
    },
  };
};

export type WorkoutSessionScreenData = ReturnType<typeof useWorkoutSessionScreen>['data'];
export type WorkoutSessionScreenActions = ReturnType<typeof useWorkoutSessionScreen>['actions'];

export default useWorkoutSessionScreen;
