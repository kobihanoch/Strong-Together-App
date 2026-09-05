import type { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import { usePrHistory } from '../../../features/workouts/history/hooks/use-pr-history.hook';
import type { RootParamList } from '../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

/** Builds the completed-workout summary and owns its navigation actions. */
const useWorkoutSummaryScreen = (
  summary: RootParamList['WorkoutSummary'],
  navigation: StackNavigationProp<RootParamList, 'WorkoutSummary'>,
) => {
  const { colors: theme } = useAppTheme();
  const { data: prData } = usePrHistory();
  const today = DateTime.local().toISODate();
  const prs = summary.exercises.flatMap((exercise) => {
    const pr = prData.getPrForExerciseId(exercise.exerciseId);
    if (!pr || DateTime.fromISO(pr.workoutStartLocal).toISODate() !== today) return [];
    return exercise.sets.some((set) => set.weight === pr.prWeight && set.reps === pr.prReps)
      ? [{ exerciseId: exercise.exerciseId, name: exercise.name, weight: pr.prWeight, reps: pr.prReps }]
      : [];
  });
  const minutes = Math.floor(summary.durationSeconds / 60);
  const seconds = String(summary.durationSeconds % 60).padStart(2, '0');

  return {
    data: {
      theme,
      workoutName: summary.workoutName,
      duration: `${minutes}:${seconds}`,
      completedSets: summary.completedSets,
      exerciseCount: summary.exercises.length,
      extraSets: summary.extraSets,
      prs,
    },
    actions: {
      viewWorkout: () => navigation.replace('TrackHistory'),
      done: () => navigation.replace('Home'),
    },
  };
};

export default useWorkoutSummaryScreen;
