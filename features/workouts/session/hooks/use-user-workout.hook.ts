import { useCallback, useState } from 'react';
import { saveWorkoutData } from '../services/workout-session.service';
import { ExerciseTrackingAndStats } from '@strong-together/shared';
import { FinishUserWorkoutBody } from '@strong-together/shared';

export const useUserWorkout = (): {
  saveWorkoutProcess: (
    workoutData: FinishUserWorkoutBody['workout'],
    startTime: number,
    endTime: number,
  ) => Promise<ExerciseTrackingAndStats>;
  saving: boolean;
} => {
  const [saving, setSaving] = useState<boolean>(false);

  const saveWorkoutProcess = useCallback(
    async (workoutData: FinishUserWorkoutBody['workout'], startTime: number, endTime: number) => {
      setSaving(true);
      try {
        const data = await saveWorkoutData(workoutData, startTime, endTime);
        return {
          exerciseTrackingMaps: data.exerciseTrackingMaps,
          exerciseTrackingAnalysis: data.exerciseTrackingAnalysis,
        };
      } catch (err) {
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return {
    saveWorkoutProcess,
    saving,
  };
};


