import { filterExercisesByDate } from "./statisticsUtils";
import moment from "moment";

export const hasWorkoutForToday = (exerciseTracking) => {
  // Check if user trained today
  if (exerciseTracking && exerciseTracking.length > 0) {
    //console.log("Has et? " + (exerciseTracking != null));
    const etByDate = filterExercisesByDate(
      exerciseTracking,
      moment().format("YYYY-MM-DD")
    );
    //console.log("HERE1");
    if (etByDate && etByDate?.length > 0) {
      return true;
    } else {
      return false;
    }
  }
};

export const filterMessagesByUnread = (messagesArr) => {
  return messagesArr.filter((msg) => msg.is_read === false);
};
