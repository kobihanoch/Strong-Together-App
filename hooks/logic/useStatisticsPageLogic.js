import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import {
  filterExercisesByDate,
  getLastWorkoutForEachExercise,
} from "../../utils/statisticsUtils";
import { useAuth } from "../../context/AuthContext";

const useStatisticsPageLogic = () => {
  const { exerciseTracking } = useAuth().workout;
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
    return filterExercisesByDate(exerciseTracking, formattedDate);
  }, [selectedDate, exerciseTracking]);

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
