/*import moment from 'moment-timezone';
import { useMemo, useState } from 'react';
import { useWorkoutHistory } from '../../shared/providers/WorkoutHistoryProvider';
import { useAerobics } from '../../shared/providers/CardioProvider';*/
//import { getLastWorkoutForEachExercise } from '../utils/statistics-page.utils';

const useStatisticsPageLogic = () => {};
/* const { exerciseTrackingMaps } = useWorkoutHistory();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Map with date keys: Date, ETSId, splitName
  const {
    byDate: exerciseTrackingWithDateKey = null,
    byExerciseToSplitId: exerciseTrackingWithETSIdKey = null,
    bySplitName: exerciseTrackingWithSplitNameKey = null,
  } = exerciseTrackingMaps || {};

  const { dailyCardioMap = null, weeklyCardioMap = null } = useAerobics() || {};

  // Start as today's date
  const [selectedDate, setSelectedDate] = useState(moment.tz(timezone).format('YYYY-MM-DD'));

  // Calculate formatted date for each change of date
  const formattedDate = useMemo(() => {
    return moment.tz(selectedDate, 'YYYY-MM-DD', timezone).format('YYYY-MM-DD');
  }, [selectedDate]);

  // For weekly map
  const startOfWeekDay = useMemo(() => {
    return moment.tz(selectedDate, 'YYYY-MM-DD', timezone).startOf('week').format('YYYY-MM-DD');
  }, [formattedDate]);

  const cardioForWeek = useMemo(() => weeklyCardioMap?.[startOfWeekDay], [startOfWeekDay, weeklyCardioMap]);

  // Cardio by date
  const cardioByDate = useMemo(() => dailyCardioMap?.[formattedDate], [formattedDate, dailyCardioMap]);

  // Change records when a date selection is aplied
  const exerciseTrackingByDate = useMemo(() => {
    return exerciseTrackingWithDateKey?.[formattedDate];
  }, [formattedDate, exerciseTrackingWithDateKey]);

  // Load prev workout data for each workout
  const exerciseTrackingByDatePrev = useMemo(() => {
    if (exerciseTrackingWithDateKey && exerciseTrackingWithSplitNameKey && exerciseTrackingWithETSIdKey)
      return getLastWorkoutForEachExercise(
        formattedDate,
        exerciseTrackingWithDateKey,
        exerciseTrackingWithSplitNameKey,
        exerciseTrackingWithETSIdKey,
      );
    return [];
  }, [formattedDate, exerciseTrackingWithDateKey, exerciseTrackingWithSplitNameKey, exerciseTrackingWithETSIdKey]);

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
};*/

export default useStatisticsPageLogic;
