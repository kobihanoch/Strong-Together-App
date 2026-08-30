import { useCallback, useState } from 'react';
import { saveWorkoutData } from '../services/workout-session.service';
import type { GetExerciseTrackingResponse } from '@strong-together/shared';
import type { WorkoutPayloadRow } from '../types/use-start-workout.types';

export const useUserWorkout = (): {
  saveWorkoutProcess: (
    workoutData: WorkoutPayloadRow[],
    startTime: number,
    endTime: number,
  ) => Promise<GetExerciseTrackingResponse>;
  saving: boolean;
} => {
  const [saving, setSaving] = useState<boolean>(false);

  const saveWorkoutProcess = useCallback(
    async (workoutData: WorkoutPayloadRow[], startTime: number, endTime: number) => {
      setSaving(true);
      try {
        const data = await saveWorkoutData(workoutData, startTime, endTime);
        return data.trackingMaps;
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


