import moment from "moment";
import { useEffect, useState } from "react";
import { filterExercisesByDate } from "../../utils/statisticsUtils";
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
    if (exerciseTracking?.length > 0 && exerciseTrackingByDate?.length > 0) {
      const sortedEtArr = [...exerciseTracking].sort(
        (a, b) => new Date(a.workoutdate) - new Date(b.workoutdate)
      );

      let previousWorkout = [];
      const currentSplit = exerciseTrackingByDate[0].splitname;
      const currentDate = exerciseTrackingByDate[0].workoutdate;

      while (sortedEtArr.length > 0) {
        const last = sortedEtArr.pop();

        if (
          last.splitname === currentSplit &&
          last.workoutdate !== currentDate
        ) {
          previousWorkout.push(last);
          break;
        }
      }

      if (previousWorkout) {
        console.log(
          "Found previous workout:",
          JSON.stringify(previousWorkout, null, 2)
        );
        setExerciseTrackingByDatePrev(previousWorkout);
      }
    }
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
