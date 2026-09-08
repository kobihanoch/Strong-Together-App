import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

export const useNotificationPermission = () => {
  const [status, setStatus] = useState<Notifications.PermissionStatus | null>(null);

  const checkPermission = useCallback(async () => {
    const permission = await Notifications.getPermissionsAsync();
    setStatus(permission.status);
    return permission;
  }, []);

  const requestPermission = useCallback(async () => {
    const current = await Notifications.getPermissionsAsync();
    const permission = current.status === Notifications.PermissionStatus.GRANTED
      ? current
      : await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: true, allowSound: true } });
    setStatus(permission.status);
    return permission;
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkPermission();
    });
    return () => subscription.remove();
  }, [checkPermission]);

  return {
    status,
    isEnabled: status === Notifications.PermissionStatus.GRANTED,
    checkPermission,
    requestPermission,
  };
};
