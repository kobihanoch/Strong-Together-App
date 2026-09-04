import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const WORKOUT_SESSION_STORAGE_KEY = 'workout-session';

export const workoutSessionStorage = createJSONStorage(() => AsyncStorage);

export const clearWorkoutSessionStorage = async (): Promise<void> => {
  await AsyncStorage.removeItem(WORKOUT_SESSION_STORAGE_KEY);
};
