import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useAnalysisContext } from "../../context/AnalysisContext";
import { getLastWorkoutForEachExercise } from "../../utils/statisticsUtils";
import { useCardioContext } from "../../context/CardioContext";

const useStatisticsPageLogic = () => {
  const { exerciseTrackingMaps = null } = useAnalysisContext() || {};

  // Map with date keys: Date, ETSId, splitName
  const {
    byDate: exerciseTrackingWithDateKey = null,
    byETSId: exerciseTrackingWithETSIdKey = null,
    bySplitName: exerciseTrackingWithSplitNameKey = null,
  } = exerciseTrackingMaps || {};

  const { dailyCardioMap = null, weeklyCardioMap = null } =
    useCardioContext() || {};

  // Start as today's date
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  // Calculate formatted date for each change of date
  const formattedDate = useMemo(() => {
    return moment(selectedDate).format("YYYY-MM-DD");
  }, [selectedDate]);

  // For weekly map
  const startOfWeekDay = useMemo(() => {
    return moment(selectedDate).startOf("week").format("YYYY-MM-DD");
  }, [formattedDate]);

  const cardioForWeek = useMemo(
    () => weeklyCardioMap?.[startOfWeekDay],
    [startOfWeekDay]
  );

  // Cardio by date
  const cardioByDate = useMemo(
    () => dailyCardioMap?.[formattedDate],
    [formattedDate]
  );

  // Change records when a date selection is aplied
  const exerciseTrackingByDate = useMemo(() => {
    return exerciseTrackingWithDateKey?.[formattedDate];
  }, [formattedDate, exerciseTrackingWithDateKey]);

  // Load prev workout data for each workout
  const exerciseTrackingByDatePrev = useMemo(() => {
    if (
      exerciseTrackingWithDateKey &&
      exerciseTrackingWithSplitNameKey &&
      exerciseTrackingWithETSIdKey
    )
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
    cardioByDate,
    cardioForWeek,
  };
};

export default useStatisticsPageLogic;
