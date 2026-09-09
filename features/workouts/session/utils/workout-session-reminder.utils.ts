import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_ID_KEY = 'workout-session-reminder-id';
const REMINDER_DELAY_SECONDS = 2 * 60 * 60;

/** Replaces the existing reminder with one scheduled two hours from now. */
export const scheduleWorkoutSessionReminder = async (workoutName: string): Promise<void> => {
  try {
    const permission = await Notifications.getPermissionsAsync();
    if (permission.status !== Notifications.PermissionStatus.GRANTED) return;

    await cancelWorkoutSessionReminder();
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('workout-reminders', {
        name: 'Workout reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Workout still active',
        body: `Your ${workoutName} workout is saved and waiting for you.`,
        data: { screen: 'WorkoutSession' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: REMINDER_DELAY_SECONDS,
        repeats: false,
        ...(Platform.OS === 'android' ? { channelId: 'workout-reminders' } : {}),
      },
    });
    await AsyncStorage.setItem(REMINDER_ID_KEY, id);
  } catch (error) {
    console.log('[Workout Session]: Could not schedule workout reminder.', error);
  }
};

/** Cancels the active workout reminder, if one exists. */
export const cancelWorkoutSessionReminder = async (): Promise<void> => {
  try {
    const id = await AsyncStorage.getItem(REMINDER_ID_KEY);
    if (id) await Notifications.cancelScheduledNotificationAsync(id);
    await AsyncStorage.removeItem(REMINDER_ID_KEY);
  } catch (error) {
    console.log('[Workout Session]: Could not cancel workout reminder.', error);
  }
};
