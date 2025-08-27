import { useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { getDaysSince } from "../../utils/homePageUtils";
import { useAuth } from "../../context/AuthContext";

const useProfilePageLogic = () => {
  const { analyzedExerciseTrackingData } = useAnalysisContext();
  const { user } = useAuth();
  const { username, email, name: fullname } = user;

  const daysOnline = useMemo(() => {
    const dataOfCreation = user.created_at.split("T")[0];
    return getDaysSince(dataOfCreation);
  }, [user]);
  const workoutCount = useMemo(() => {
    return analyzedExerciseTrackingData
      ? analyzedExerciseTrackingData.workoutCount
      : 0;
  }, [analyzedExerciseTrackingData]);

  const [mediaLoading, setMediaLoading] = useState(false);

  return {
    data: {
      username,
      email,
      fullname,
      workoutCount,
      daysOnline,
    },
    mediaLoading,
    setMediaLoading,
  };
};

export default useProfilePageLogic;
