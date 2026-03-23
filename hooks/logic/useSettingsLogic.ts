import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

const useSettingsLogic = () => {
  // "granted" | "denied" | "undetermined" | null (initial)
  const [notificationsPermissionStatus, setNotificationsPermissionStatus] = useState<
    Notifications.NotificationPermissionsStatus['status'] | null
  >(null);

  // Derived boolean for UI logic
  const hasNotificationsPermission = notificationsPermissionStatus === 'granted';

  // Check current permission without prompting
  const checkNotificationsPermission = async () => {
    const perm = await Notifications.getPermissionsAsync();
    setNotificationsPermissionStatus(perm.status);
    return perm;
  };

  // Ask the user for permission (only if not already granted)
  const requestNotificationsPermission = async () => {
    const before = await Notifications.getPermissionsAsync();
    if (before.status === Notifications.PermissionStatus.GRANTED) {
      setNotificationsPermissionStatus(Notifications.PermissionStatus.GRANTED);
      return before;
    }

    const after = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        //allowAnnouncements: true,
      },
    });

    setNotificationsPermissionStatus(after.status);
    return after;
  };

  useEffect(() => {
    checkNotificationsPermission();
  }, [checkNotificationsPermission]);

  // Optional: label for settings screen
  /*const notificationsPermissionLabel = useMemo(() => {
    switch (notificationsPermissionStatus) {
      case Notifications.PermissionStatus.GRANTED:
        return 'Notifications: Allowed';
      case Notifications.PermissionStatus.DENIED:
        return 'Notifications: Denied';
      case Notifications.PermissionStatus.UNDETERMINED:
        return 'Notifications: Not determined';
      case null:
        return 'Notifications: Checking…';
      default:
        return 'Notifications: Unknown';
    }
  }, [notificationsPermissionStatus]);*/

  return {
    notificationsPermissionStatus,
    hasNotificationsPermission,
    //notificationsPermissionLabel,
    checkNotificationsPermission,
    requestNotificationsPermission,
  };
};

export default useSettingsLogic;
