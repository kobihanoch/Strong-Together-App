import { AddWorkoutBody, FinishUserWorkoutBody, GetExerciseTrackingQuery } from './../types/api/workouts/requests';
import api from '../api/api';
import { GetWholeUserWorkoutPlanQuery } from '../types/api/workouts/requests';
import {
  AddWorkoutResponse,
  FinishUserWorkoutResponse,
  GetExerciseTrackingResponse,
  GetWholeUserWorkoutPlanResponse,
} from '../types/api/workouts/responses';

// Fetch self workout plan
export const getUserWorkout = async (): Promise<GetWholeUserWorkoutPlanResponse> => {
  const { data } = await api.get<GetWholeUserWorkoutPlanResponse>('/api/workouts/getworkout', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetWholeUserWorkoutPlanQuery,
  });
  return data;
};

// Gets user exercise tracking data - including home page ata PR most common etc...
export const getUserExerciseTracking = async (): Promise<GetExerciseTrackingResponse> => {
  const { data } = await api.get<GetExerciseTrackingResponse>(`/api/workouts/gettracking`, {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetExerciseTrackingQuery,
  });
  return data;
};

// Add a new workout plan
export const addWorkout = async (workoutData: AddWorkoutBody['workoutData']): Promise<AddWorkoutResponse> => {
  const { data } = await api.post<AddWorkoutResponse>('/api/workouts/add', {
    workoutData,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  } satisfies AddWorkoutBody);
  return data;
};

// Saves a workout after working out - startworkout.js
export const saveWorkoutData = async (
  dataOfWorkout: FinishUserWorkoutBody['workout'],
  startTime: FinishUserWorkoutBody['workout_start_utc'],
  endTime: FinishUserWorkoutBody['workout_end_utc'],
): Promise<FinishUserWorkoutResponse> => {
  startTime = new Date(startTime).toISOString();
  endTime = new Date(endTime).toISOString();

  const { data } = await api.post<FinishUserWorkoutResponse>('/api/workouts/finishworkout', {
    workout: dataOfWorkout,
    workout_start_utc: startTime,
    workout_end_utc: endTime,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return data;
};
