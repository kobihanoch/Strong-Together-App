import moment from "moment";
import { useEffect, useState } from "react";
import { filterExercisesByDate } from "../../utils/statisticsUtils";
import { useUserWorkout } from "../useUserWorkout";

const useStatisticsPageLogic = (user) => {
  const { loading, fetchUserExerciseTracking, exerciseTracking } =
    useUserWorkout(user?.id);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [exerciseTrackingByDate, setExerciseTrackingByDate] = useState(null);

  // Gets all exercise tracking of user
  useEffect(() => {
    fetchUserExerciseTracking();
  }, []);

  useEffect(() => {
    setExerciseTrackingByDate(
      filterExercisesByDate(exerciseTracking, selectedDate)
    );
  }, [exerciseTracking, selectedDate]);

  return {
    loading,
    selectedDate,
    setSelectedDate,
    exerciseTracking,
    exerciseTrackingByDate,
  };
};

export default useStatisticsPageLogic;
