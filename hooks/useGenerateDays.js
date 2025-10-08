import moment from "moment-timezone";
import { useState, useEffect, useCallback } from "react";

const useGenerateDays = (timezone = "Asia/Jerusalem") => {
  const [datesList, setDatesList] = useState(null);

  const generateDates = useCallback(() => {
    const days = [];
    const start = moment.tz(timezone).clone().subtract(45, "days");
    const end = moment.tz(timezone).clone().add(45, "days");

    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      days.push(current.clone());
      current.add(1, "day");
    }
    setDatesList(days);
  }, [timezone]);

  useEffect(() => {
    generateDates();
  }, [generateDates]);

  return { datesList };
};

export default useGenerateDays;
