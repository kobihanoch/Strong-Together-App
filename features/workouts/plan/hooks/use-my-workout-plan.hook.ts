import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import { RootParamList } from '../../../../navigation/types/appStackTypes';
import { useAppTheme } from '../../../../shared/providers/AppThemeProvider';
import { useWorkoutHistory } from '../../history/hooks/use-workout-history.hook';
import type { WorkoutSplit } from '../types/workout-plan.types';
import { useWorkoutPlan } from './use-workout-plan.hook';

const useMyWorkoutPlan = () => {
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const { colors: theme } = useAppTheme();
  const {
    data: { workoutPlan, workoutSplits, hasWorkoutPlan },
    loadingStates: { isLoading },
  } = useWorkoutPlan();
  const { data } = useWorkoutHistory();
  const [selectedSplitId, setSelectedSplitId] = useState<number | null>(null);

  useEffect(() => {
    if (!workoutSplits.length) return setSelectedSplitId(null);
    if (!workoutSplits.some((split) => split.id === selectedSplitId)) setSelectedSplitId(workoutSplits[0].id);
  }, [selectedSplitId, workoutSplits]);

  const selectedSplit = useMemo<WorkoutSplit | null>(
    () => workoutSplits.find((split) => split.id === selectedSplitId) ?? workoutSplits[0] ?? null,
    [selectedSplitId, workoutSplits],
  );
  const setCount = selectedSplit?.exercises.reduce((total, exercise) => total + exercise.sets.length, 0) ?? 0;
  const muscles = useMemo(
    () => Array.from(new Set(selectedSplit?.exercises.map((exercise) => exercise.targetMuscle) ?? [])).slice(0, 3),
    [selectedSplit],
  );

  return {
    data: {
      theme,
      isLoading,
      hasWorkoutPlan,
      workoutPlan,
      workoutSplits,
      selectedSplit,
      setCount,
      muscles,
      hasTrainedToday: data.hasTrainedToday,
    },
    actions: {
      selectSplit: (split: WorkoutSplit) => setSelectedSplitId(split.id),
      createPlan: () => navigation.navigate('CreateWorkout'),
      editPlan: () => navigation.navigate('CreateWorkout'),
      startWorkout: () => selectedSplit && navigation.navigate('StartWorkout', { workoutSplit: selectedSplit }),
    },
  };
};

export default useMyWorkoutPlan;
