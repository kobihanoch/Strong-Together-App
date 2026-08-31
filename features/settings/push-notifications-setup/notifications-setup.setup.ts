// notifications/NotificationsSetup.jsx
import { useEffect } from "react";
import { useAuth } from '../../auth/shared/providers/AuthProvider';
import { setupPush } from "./push-notifications.setup";

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
