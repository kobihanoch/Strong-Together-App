import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWorkoutSessionStore } from '../hooks/use-workout-session-store.hook';
import { WORKOUT_SESSION_STORAGE_KEY } from './workout-session-storage.config';

export { WORKOUT_SESSION_CACHE_VERSION, WORKOUT_SESSION_STORAGE_KEY, workoutSessionStorage } from './workout-session-storage.config';

/** Clears the active workout session draft if exists */
export const clearWorkoutSessionStorage = async (): Promise<void> => {
  useWorkoutSessionStore.getState().resetWorkout();
  await AsyncStorage.removeItem(WORKOUT_SESSION_STORAGE_KEY);
};
