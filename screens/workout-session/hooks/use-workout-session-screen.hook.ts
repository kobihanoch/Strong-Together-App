import type { CreateWorkoutSessionBody } from '@strong-together/shared';
import { useEffect } from 'react';
import { useExerciseHistory } from '../../../features/workouts/history/hooks/use-exercise-history.hook';
import type { WorkoutSplit } from '../../../features/workouts/plan/types/workout-plan.types';
import { useWorkoutSession } from '../../../features/workouts/session/hooks/use-workout-session.hook';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

type WorkoutEntry = CreateWorkoutSessionBody['workout'][number];
type TrackedSet = WorkoutEntry['trackedSets'][number];

/** Connects the Workout Session screen to the persisted session feature. */
const useWorkoutSessionScreen = (workoutSplit: WorkoutSplit) => {
  const { colors: theme } = useAppTheme();
  const { actions, data, loadingStates } = useWorkoutSession();
  const { startWorkout, discardWorkout } = actions;
  const { data: history } = useExerciseHistory();
  const { activeExerciseIndex: exerciseIndex, activeSetIndex: setIndex, completedSetKeys, rest } = data.progress;

  useEffect(() => {
    if (data.draft || !workoutSplit.exercises.length) return;
    startWorkout(
      workoutSplit.exercises.map<WorkoutEntry>((exercise) => ({
        exerciseId: null,
        exerciseToSplitId: exercise.exerciseToSplitId,
        isExerciseAssignedToSplit: true,
        notes: null,
        trackedSets: exercise.sets.map<TrackedSet>((set) => ({
          setIndex: set.orderIndex,
          reps: 0,
          weight: 0,
        })),
      })),
      workoutSplit,
    );
  }, [data.draft, startWorkout, workoutSplit]);

  const draftExercise = data.draft?.workout[exerciseIndex] ?? null;
  const planExercise = workoutSplit.exercises.find((exercise) => exercise.exerciseToSplitId === draftExercise?.exerciseToSplitId);
  const activeSet = draftExercise?.trackedSets[setIndex] ?? null;
  const previousSet = history.getLastPerformanceForExercise(planExercise?.exerciseToSplitId ?? null)?.performance?.[setIndex] ?? null;
  const exerciseKey = draftExercise?.exerciseToSplitId ?? `added-${draftExercise?.exerciseId ?? exerciseIndex}`;
  const setKey = `${exerciseKey}:${activeSet?.setIndex ?? setIndex}`;

  const totalSets = data.draft?.workout.reduce((total, exercise) => total + exercise.trackedSets.length, 0) ?? 0;
  const completedCount = completedSetKeys.length;
  const navigatorExercises = (data.draft?.workout ?? []).map((exercise, index) => {
    const plannedExercise = workoutSplit.exercises.find((item) => item.exerciseToSplitId === exercise.exerciseToSplitId);
    const key = exercise.exerciseToSplitId ?? `added-${exercise.exerciseId ?? index}`;
    return {
      key: String(key),
      name: plannedExercise?.name ?? 'Added exercise',
      isAdded: !exercise.isExerciseAssignedToSplit,
      completedSets: exercise.trackedSets.filter((set) => completedSetKeys.includes(`${key}:${set.setIndex}`)).length,
      totalSets: exercise.trackedSets.length,
    };
  });

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

    const nextSetIndex = draftExercise?.trackedSets.findIndex(
      (set, index) => index > setIndex && !completedSetKeys.includes(`${exerciseKey}:${set.setIndex}`),
    );
    if (nextSetIndex !== undefined && nextSetIndex >= 0) actions.setActiveSet(nextSetIndex);
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

  return {
    data: {
      theme,
      workoutName: workoutSplit.name,
      workoutStartedAtUtc: data.draft?.workoutStartUtc ?? null,
      exerciseName: planExercise?.name ?? 'Exercise',
      exerciseIndex,
      exerciseKey: String(exerciseKey),
      exerciseCount: data.draft?.workout.length ?? workoutSplit.exercises.length,
      setIndex,
      sets: draftExercise?.trackedSets ?? [],
      plannedSetCount: planExercise?.sets.length ?? 0,
      isActiveSetExtra: setIndex >= (planExercise?.sets.length ?? 0),
      activeSet,
      previousSet,
      completedSetKeys,
      completedCount,
      totalSets,
      rest,
      navigatorExercises,
      isSaving: loadingStates.isSaving,
    },
    actions: {
      previousExercise: () => selectExercise(exerciseIndex - 1),
      nextExercise: () => selectExercise(exerciseIndex + 1),
      selectExercise,
      reorderExercises: actions.reorderExercises,
      selectSet: actions.setActiveSet,
      addSet,
      removeSet,
      removeActiveSet: () => activeSet && removeSet(activeSet.setIndex),
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
