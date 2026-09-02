import { useEffect, useMemo, useState } from 'react';
import { useExerciseHistory } from '../../../features/workouts/history/hooks/use-exercise-history.hook';
import { usePrHistory } from '../../../features/workouts/history/hooks/use-pr-history.hook';
import { useWorkoutHistory } from '../../../features/workouts/history/hooks/use-workout-history.hook';
import { useWorkoutPlan } from '../../../features/workouts/plan/hooks/use-workout-plan.hook';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import {
  buildTrackExercises,
  getPlannedSetCounts,
  getTrackHistoryDateBounds,
  getTrackWorkout,
  getTrackWorkoutDates,
} from '../utils/track-history.utils';

/**
 * Builds the Track History screen state from workout, exercise-history, and PR data.
 * It owns only selected-date and expanded-exercise UI state; calculations live in utilities.
 */
const useTrackHistory = () => {
  const { colors: theme } = useAppTheme();
  const { data: workoutData, loadingStates: workoutLoading } = useWorkoutHistory();
  const { data: exerciseData, loadingStates: exerciseLoading } = useExerciseHistory();
  const { data: prsData, loadingStates: prsLoading } = usePrHistory();
  const { data: planData, loadingStates: planLoading } = useWorkoutPlan();

  const { today, minDate } = getTrackHistoryDateBounds();
  const [selectedDate, setSelectedDate] = useState(today);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Derive the selected workout and its display-ready exercises.
  const workout = getTrackWorkout(workoutData.workoutHistoryMap, selectedDate);
  const exercises = useMemo(
    () =>
      buildTrackExercises(
        workout,
        prsData.prHistoryMap,
        selectedDate,
        getPlannedSetCounts(planData.workoutSplits),
        exerciseData.getExerciseHistoryData,
        exerciseData.getLastWorkoutData,
      ),
    [
      prsData.prHistoryMap,
      planData.workoutSplits,
      exerciseData.getExerciseHistoryData,
      exerciseData.getLastWorkoutData,
      selectedDate,
      workout,
    ],
  );

  // Open the first exercise whenever a new workout is selected.
  useEffect(() => {
    setExpandedId(exercises[0]?.id ?? null);
  }, [selectedDate, exercises]);

  const setDate = (date: string) => {
    setSelectedDate(date);
    setExpandedId(null);
  };

  return {
    data: {
      theme,
      today,
      minDate,
      selectedDate,
      workout,
      exercises,
      expandedId,
      workoutDates: getTrackWorkoutDates(workoutData.workoutHistoryMap),
      isLoading: workoutLoading.isPending || exerciseLoading.isPending || prsLoading.isPending || planLoading.isPending,
    },
    actions: { setDate, toggleExercise: (id: number) => setExpandedId((current) => (current === id ? null : id)) },
  };
};

export default useTrackHistory;
