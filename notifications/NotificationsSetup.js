// notifications/NotificationsSetup.jsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { setupPush } from "./setup";

const NotificationsSetup = () => {
  const { user, isValidatedWithServer } = useAuth();

  useEffect(() => {
    if (user?.id && isValidatedWithServer) {
      setupPush(user.id).catch(() => {});
    }
  }, [user?.id, isValidatedWithServer]);

  return null;
};

export default NotificationsSetup;
