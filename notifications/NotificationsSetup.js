// notifications/NotificationsSetup.jsx
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { setupPush } from "./setup";

const NotificationsSetup = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      setupPush(user.id).catch(() => {});
    }
  }, [user?.id]);

  return null;
};

export default NotificationsSetup;
