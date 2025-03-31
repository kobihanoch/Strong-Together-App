import moment from "moment";
import { useEffect, useState } from "react";
import {
  filterExercisesByDate,
  getLastWorkoutForEachExercise,
} from "../../utils/statisticsUtils";
import { useUserWorkout } from "../useUserWorkout";

const useStatisticsPageLogic = (user) => {
  const { loading, fetchUserExerciseTracking, exerciseTracking } =
    useUserWorkout(user?.id);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [exerciseTrackingByDate, setExerciseTrackingByDate] = useState(null);
  const [exerciseTrackingByDatePrev, setExerciseTrackingByDatePrev] =
    useState(null);

  // Gets all exercise tracking of user
  useEffect(() => {
    fetchUserExerciseTracking();
  }, []);

  useEffect(() => {
    setExerciseTrackingByDatePrev(
      getLastWorkoutForEachExercise(exerciseTracking, exerciseTrackingByDate)
    );
  }, [exerciseTracking, exerciseTrackingByDate]);

  useEffect(() => {
    if (exerciseTracking && exerciseTracking.length > 0) {
      setExerciseTrackingByDate(
        filterExercisesByDate(exerciseTracking, selectedDate)
      );
    }
  }, [exerciseTracking, selectedDate]);

  return {
    loading,
    selectedDate,
    setSelectedDate,
    exerciseTracking,
    exerciseTrackingByDate,
    exerciseTrackingByDatePrev,
  };
};

export default useStatisticsPageLogic;
