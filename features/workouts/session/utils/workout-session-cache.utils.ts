import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { CACHE_VERSION } from '../../../../infrastructure/cache/cache.constants';
import { useWorkoutSessionStore } from '../hooks/use-workout-session-store.hook';

export const WORKOUT_SESSION_STORAGE_KEY = 'workout-session';
export const WORKOUT_SESSION_CACHE_VERSION = Number(CACHE_VERSION?.replace(/\D/g, '') ?? 0);

export const workoutSessionStorage = createJSONStorage(() => AsyncStorage);

export const clearWorkoutSessionStorage = async (): Promise<void> => {
  useWorkoutSessionStore.getState().resetWorkout();
  useWorkoutSessionStore.persist.clearStorage();
};
