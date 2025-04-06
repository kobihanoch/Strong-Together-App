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

  // Load prev workout data for each workout
  useEffect(() => {
    setExerciseTrackingByDatePrev(
      getLastWorkoutForEachExercise(exerciseTracking, exerciseTrackingByDate)
    );
  }, [exerciseTracking, exerciseTrackingByDate]);

  // Load when changing dates
  useEffect(() => {
    if (exerciseTracking && exerciseTracking.length > 0) {
      setExerciseTrackingByDate(
        filterExercisesByDate(exerciseTracking, selectedDate)
      );
    }
  }, [selectedDate]);

  // Load selected workout on load up
  useEffect(() => {
    if (!loading && exerciseTracking && exerciseTracking.length > 0) {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const filtered = filterExercisesByDate(exerciseTracking, formattedDate);
      setExerciseTrackingByDate(filtered);
    }
  }, [loading]);

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
