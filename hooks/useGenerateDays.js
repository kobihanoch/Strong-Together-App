import moment from "moment";
import { useState, useEffect, useCallback } from "react";

const useGenerateDays = () => {
  const [datesList, setDatesList] = useState(null);

  const generateDates = useCallback(() => {
    const days = [];
    const start = moment().clone().subtract(45, "days");
    const end = moment().clone().add(45, "days");

    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      days.push(current.clone());
      current.add(1, "day");
    }
    setDatesList(days);
  }, []);

  useEffect(() => {
    generateDates();
  }, []);

  return { datesList };
};

export default useGenerateDays;
