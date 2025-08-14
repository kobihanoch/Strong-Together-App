import moment from "moment";
import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getExerciseTrackingMappedByDate,
  getLastWorkoutForEachExercise,
} from "../../utils/statisticsUtils";

const useStatisticsPageLogic = () => {
  const { exerciseTracking } = useAuth().workout;
  const exerciseTrackingWithDateKey = useMemo(() => {
    return getExerciseTrackingMappedByDate(exerciseTracking);
  }, [exerciseTracking]);

  // Start as today's date
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // Calculate formatted date for each change of date
  const formattedDate = useMemo(() => {
    return moment(selectedDate).format("YYYY-MM-DD");
  }, [selectedDate, exerciseTracking]);

  // Change records when a date selection is aplied
  const exerciseTrackingByDate = useMemo(() => {
    return exerciseTrackingWithDateKey[formattedDate];
  }, [formattedDate, exerciseTrackingWithDateKey]);

  // Load prev workout data for each workout
  const exerciseTrackingByDatePrev = useMemo(() => {
    return getLastWorkoutForEachExercise(
      exerciseTracking,
      exerciseTrackingByDate
    );
  }, [exerciseTracking, exerciseTrackingByDate]);

  return {
    selectedDate,
    setSelectedDate,
    exerciseTracking,
    exerciseTrackingByDate,
    exerciseTrackingByDatePrev,
  };
};

export default useStatisticsPageLogic;
