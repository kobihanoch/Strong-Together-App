import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { getLastWorkoutForEachExercise } from "../../utils/statisticsUtils";

const useStatisticsPageLogic = () => {
  const { exerciseTrackingMaps } = useAnalysisContext();

  // Map with date keys: Date, ETSId, splitName
  const {
    byDate: exerciseTrackingWithDateKey,
    byETSId: exerciseTrackingWithETSIdKey,
    bySplitName: exerciseTrackingWithSplitNameKey,
  } = exerciseTrackingMaps;

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
      exerciseTrackingWithETSIdKey
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
    exerciseTrackingByDate,
    exerciseTrackingByDatePrev,
    exerciseTrackingWithDateKey,
    exerciseTrackingWithETSIdKey,
  };
};

export default useStatisticsPageLogic;
