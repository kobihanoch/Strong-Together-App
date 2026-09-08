import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AppState, AppStateStatus, Linking, Switch } from 'react-native';
import { useNotificationPermission } from '../../../shared/hooks/use-notification-permission.hook';
import { useAppTheme } from '../../../shared/providers/AppThemeProvider';

const ProfileNotificationsToggle = () => {
  const permission = useNotificationPermission();
  const { colors } = useAppTheme();
  const [isBusy, setIsBusy] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appState.current;
      appState.current = nextState;
      if (nextState === 'active' && previousState !== 'active') permission.checkPermission();
    });
    return () => subscription.remove();
  }, [permission]);

  const handleChange = async (nextValue: boolean) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      if (nextValue) {
        const result = await permission.requestPermission();
        if (result?.status !== Notifications.PermissionStatus.GRANTED) {
          Alert.alert('Notifications are off', 'You can allow notifications from your device settings.', [
            { text: 'Not now', style: 'cancel' },
            { text: 'Open settings', onPress: Linking.openSettings },
          ]);
        }
        await permission.checkPermission();
        return;
      }

      Alert.alert('Turn off notifications?', 'Notification permission is controlled by your device settings.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open settings', onPress: Linking.openSettings },
      ]);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Switch
      accessibilityLabel="Notifications"
      value={permission.isEnabled}
      disabled={isBusy}
      onValueChange={handleChange}
      trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
      thumbColor={colors.white}
      ios_backgroundColor={colors.surfaceMuted}
    />
  );
};

export default ProfileNotificationsToggle;
