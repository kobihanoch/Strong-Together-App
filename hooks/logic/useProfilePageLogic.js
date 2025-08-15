import { useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { getDaysSince } from "../../utils/homePageUtils";

const useProfilePageLogic = (user) => {
  const { analyzedExerciseTrackingData } = useAnalysisContext();
  const username = useMemo(() => {
    return user.username;
  }, [user]);
  const email = useMemo(() => {
    return user.email;
  }, [user]);
  const fullname = useMemo(() => {
    return user.name;
  }, [user]);
  const daysOnline = useMemo(() => {
    const dataOfCreation = user.created_at.split("T")[0];
    return getDaysSince(dataOfCreation);
  }, [user]);
  const workoutCount = useMemo(() => {
    return analyzedExerciseTrackingData.workoutCount;
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
