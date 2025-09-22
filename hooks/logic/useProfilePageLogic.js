import { useAuth } from "../../context/AuthContext";
import { getDaysSince } from "../../utils/homePageUtils";

const useProfilePageLogic = () => {
  const { user } = useAuth();
  const { username, email, name: fullName, gender } = user;

  const daysOnline = getDaysSince(user.created_at.split("T")[0]);

  return {
    data: {
      username,
      email,
      fullName,
      gender,
      daysOnline,
    },
  };
};

export default useProfilePageLogic;
