import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWorkoutHistoryContext } from '../../shared/providers/WorkoutHistoryProvider';
import { WorkoutSplit } from '../../shared/types/workout.types';
import { useWorkoutPlanContext } from '../../shared/providers/WorkoutPlanProvider';

type ExerciseCounter = Record<WorkoutSplit['name'], number>;

export const useMyWorkoutPlanPageLogic = () => {
  const { workout, workoutForEdit, workoutSplits, exercises: allExercises } = useWorkoutPlanContext();

  const hasWorkout = useMemo(() => !!workout, [workout]);

  const exerciseCounter = useMemo(() => {
    if (!hasWorkout) return;
    return Object.entries(workoutForEdit!).reduce((acc: ExerciseCounter, [s, ex]) => {
      const exCount = ex.length;
      const splitName = s;
      acc[splitName] = exCount;
      return acc;
    }, {});
  }, [hasWorkout, workoutForEdit]);

  const { analyzedExerciseTrackingData, hasTrainedToday } = useWorkoutHistoryContext();
  const [selectedSplit, setSelectedSplit] = useState<WorkoutSplit | null>(null);

  // Set selected split at startup
  useEffect(() => {
    if (workoutSplits && workoutSplits.length > 0) {
      setSelectedSplit(workoutSplits[0]);
    }
  }, [workoutSplits]);

  // Filter exercises by selected split
  const filteredExercises = useMemo(() => {
    if (!selectedSplit) return;
    return allExercises[selectedSplit.name];
  }, [allExercises, selectedSplit]);

  // Gets preformed split count
  const splitTrainedCount = useMemo(() => {
    if (!analyzedExerciseTrackingData || !selectedSplit) return;
    return analyzedExerciseTrackingData.splitDaysByName[selectedSplit.name] ?? 0;
  }, [analyzedExerciseTrackingData, selectedSplit]);

  // Handling selection of split
  const handleWorkoutSplitPress = useCallback((split: WorkoutSplit) => {
    setSelectedSplit(split);
  }, []);

  return {
    workout,
    hasWorkout,
    workoutSplits,
    allExercises,
    selectedSplit,
    setSelectedSplit,
    handleWorkoutSplitPress,
    filteredExercises,
    splitTrainedCount,
    hasTrainedToday,
    exerciseCounter,
  };
};
