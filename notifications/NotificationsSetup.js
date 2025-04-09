// notifications/NotificationsSetup.js
import { useEffect } from "react";
import { requestPushToken } from "./NotificationsManager";
import { useAuth } from "../context/AuthContext";
import { savePushTokenToDB } from "../services/UserService";

const NotificationsSetup = () => {
  const { user } = useAuth();

  useEffect(() => {
    const setup = async () => {
      if (!user?.id) return;

      const token = await requestPushToken();
      if (token) {
        console.log("📱 Push Token:", token);

        await savePushTokenToDB(user.id, token);
      }
    };

    setup();
  }, [user]);

  return null;
};

export default NotificationsSetup;
