import { useEffect, useMemo, useState } from 'react';
import { useExerciseHistory } from '../../../features/workouts/history/hooks/use-exercise-history.hook';
import { usePrHistory } from '../../../features/workouts/history/hooks/use-pr-history.hook';
import { useWorkoutHistory } from '../../../features/workouts/history/hooks/use-workout-history.hook';
import { useWorkoutPlan } from '../../../features/workouts/plan/hooks/use-workout-plan.hook';
import { useCardio } from '../../../features/workouts/cardio/hooks/use-cardio.hook';
import { EditableCardioRecord } from '../../../features/workouts/cardio/types/cardio.types';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';
import {
  buildTrackExercises,
  getPlannedSetCounts,
  getTrackHistoryDateBounds,
  getTrackCardioWeek,
  getTrackWorkout,
  getTrackWorkoutDates,
} from '../utils/track-history.utils';

/**
 * Builds the Track History screen state from workout, exercise-history, and PR data.
 * It owns only selected-date and expanded-exercise UI state; calculations live in utilities.
 */
const useTrackHistory = (initialDate?: string) => {
  const { colors: theme } = useAppTheme();
  const { data: workoutData, loadingStates: workoutLoading } = useWorkoutHistory();
  const { data: exerciseData, loadingStates: exerciseLoading } = useExerciseHistory();
  const { data: prsData, loadingStates: prsLoading } = usePrHistory();
  const { data: planData, loadingStates: planLoading } = useWorkoutPlan();
  const { data: cardioData, loadingStates: cardioLoading, actions: cardioActions } = useCardio();

  const { today, minDate } = getTrackHistoryDateBounds();
  const routeDate = initialDate?.slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(routeDate ?? today);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Keep the selected day in sync when an existing History screen receives new route params.
  useEffect(() => {
    if (routeDate) setSelectedDate(routeDate);
  }, [routeDate]);

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

  // Daily records will include these editable fields when the new API is connected.
  const cardioRecords = (cardioData.dailyCardioMap?.[selectedDate] ?? []) as EditableCardioRecord[];
  const activityDates = new Set([
    ...getTrackWorkoutDates(workoutData.workoutHistoryMap),
    ...Object.keys(cardioData.dailyCardioMap ?? {}),
  ]);

  return {
    data: {
      theme,
      today,
      minDate,
      selectedDate,
      workout,
      exercises,
      expandedId,
      workoutDates: activityDates,
      cardioRecords,
      cardioWeek: getTrackCardioWeek(cardioData.weeklyCardioMap, selectedDate),
      isCardioEditing: cardioLoading.isEditing,
      isCardioDeleting: cardioLoading.isDeleting,
      isLoading: workoutLoading.isPending || exerciseLoading.isPending || prsLoading.isPending || planLoading.isPending || cardioLoading.isPending,
    },
    actions: {
      setDate,
      toggleExercise: (id: number) => setExpandedId((current) => (current === id ? null : id)),
      updateCardio: (id: number, record: Parameters<typeof cardioActions.updateCardio>[0]['record']) => cardioActions.updateCardio({ id, record }),
      deleteCardio: cardioActions.deleteCardio,
    },
  };
};

export default useTrackHistory;
