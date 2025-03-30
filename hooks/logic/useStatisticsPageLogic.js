import moment from "moment";
import { useEffect, useState } from "react";
import { useUserWorkout } from "../useUserWorkout";

const useStatisticsPageLogic = (user) => {
  const { workoutSplits, loading } = useUserWorkout(user?.id);
  const [splitsCount, setSplitsCount] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());

  useEffect(() => {
    if (workoutSplits && workoutSplits.length > 0) {
      setSplitsCount(workoutSplits.length);
    }
  }, [workoutSplits]);
  return { splitsCount, loading, selectedDate, setSelectedDate };
};

export default useStatisticsPageLogic;
