import moment from "moment";
import { useEffect, useState } from "react";
import {
  filterExercisesByDate,
  getLastWorkoutForEachExercise,
} from "../../utils/statisticsUtils";
import { useAuth } from "../../context/AuthContext";

const useStatisticsPageLogic = (user) => {
  const { exerciseTracking } = useAuth().workout;
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const [exerciseTrackingByDate, setExerciseTrackingByDate] = useState(null);
  const [exerciseTrackingByDatePrev, setExerciseTrackingByDatePrev] =
    useState(null);

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
  }, [selectedDate, exerciseTracking]);

  // Load selected workout on load up
  useEffect(() => {
    if (exerciseTracking && exerciseTracking.length > 0) {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const filtered = filterExercisesByDate(exerciseTracking, formattedDate);
      setExerciseTrackingByDate(filtered);
    }
  }, []);

  return {
    selectedDate,
    setSelectedDate,
    exerciseTracking,
    exerciseTrackingByDate,
    exerciseTrackingByDatePrev,
  };
};

export default useStatisticsPageLogic;
