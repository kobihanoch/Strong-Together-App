// notifications/NotificationsSetup.jsx
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../../features/auth/providers/AuthProvider';
import { setupPush } from './push-notifications.setup';

// Expo requires an explicit handler to present notifications while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationsSetup = () => {
  const { userIdCache: userId, isValidatedWithServer } = useAuth();

  useEffect(() => {
    if (userId && isValidatedWithServer) {
      setupPush(userId).catch(() => {});
    }
  }, [userId, isValidatedWithServer]);

  return null;
};

export default NotificationsSetup;
