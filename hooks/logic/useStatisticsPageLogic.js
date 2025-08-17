import moment from "moment";
import { useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import {
  getExerciseTrackingMapped,
  getLastWorkoutForEachExercise,
} from "../../utils/statisticsUtils";

const useStatisticsPageLogic = () => {
  const { exerciseTracking } = useAnalysisContext();

  // Map with date keys: Date, ETSId, splitName
  const {
    byDate: exerciseTrackingWithDateKey,
    byETSId: exerciseTrackingWithETSIdKey,
    bySplitName: exerciseTrackingWithSplitNameKey,
    splitDatesDesc,
  } = useMemo(() => {
    return getExerciseTrackingMapped(exerciseTracking);
  }, [exerciseTracking]);

  // Start as today's date
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // Calculate formatted date for each change of date
  const formattedDate = useMemo(() => {
    return moment(selectedDate).format("YYYY-MM-DD");
  }, [selectedDate]);

  // Change records when a date selection is aplied
  const exerciseTrackingByDate = useMemo(() => {
    return exerciseTrackingWithDateKey[formattedDate];
  }, [formattedDate, exerciseTrackingWithDateKey]);

  // Load prev workout data for each workout
  const exerciseTrackingByDatePrev = useMemo(() => {
    return getLastWorkoutForEachExercise(
      formattedDate,
      exerciseTrackingWithDateKey,
      exerciseTrackingWithSplitNameKey,
      exerciseTrackingWithETSIdKey,
      splitDatesDesc
    );
  }, [
    formattedDate,
    exerciseTrackingWithDateKey,
    exerciseTrackingWithSplitNameKey,
    exerciseTrackingWithETSIdKey,
  ]);

  return {
    selectedDate,
    setSelectedDate,
    exerciseTracking,
    exerciseTrackingByDate,
    exerciseTrackingByDatePrev,
    exerciseTrackingWithETSIdKey,
    splitDatesDesc,
  };
};

export default useStatisticsPageLogic;
