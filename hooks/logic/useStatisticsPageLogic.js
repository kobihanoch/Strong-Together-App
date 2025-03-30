import moment from "moment";
import { useEffect, useState } from "react";
import { useUserWorkout } from "../useUserWorkout";

const useStatisticsPageLogic = (user) => {
  const { loading, fetchUserExerciseTracking, exerciseTracking } =
    useUserWorkout(user?.id);
  const [selectedDate, setSelectedDate] = useState(moment());

  // Gets all exercise tracking of user
  useEffect(() => {
    fetchUserExerciseTracking();
  }, []);

  return { loading, selectedDate, setSelectedDate, exerciseTracking };
};

export default useStatisticsPageLogic;
