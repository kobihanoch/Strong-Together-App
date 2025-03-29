import { useEffect, useState } from "react";
import { useUserWorkout } from "../useUserWorkout";

const useStatisticsPageLogic = (user) => {
  const { workoutSplits, loading } = useUserWorkout(user?.id);
  const [splitsCount, setSplitsCount] = useState(null);

  useEffect(() => {
    if (workoutSplits && workoutSplits.length > 0) {
      setSplitsCount(workoutSplits.length);
    }
  }, [workoutSplits]);
  return { splitsCount, loading };
};

export default useStatisticsPageLogic;
