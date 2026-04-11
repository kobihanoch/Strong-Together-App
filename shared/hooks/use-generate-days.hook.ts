import moment from 'moment-timezone';
import { useState, useEffect, useCallback } from 'react';

const useGenerateDays = (timezone: string = 'Asia/Jerusalem'): { datesList: moment.Moment[] | null } => {
  const [datesList, setDatesList] = useState<moment.Moment[] | null>(null);

  const generateDates = useCallback((): void => {
    const days: moment.Moment[] = [];
    const start = moment.tz(timezone).subtract(45, 'days');
    const end = moment.tz(timezone).add(45, 'days');

    const current = start.clone();
    while (current.isSameOrBefore(end)) {
      days.push(current.clone());
      current.add(1, 'day');
    }
    setDatesList(days);
  }, [timezone]);

  useEffect(() => {
    generateDates();
  }, [generateDates]);

  return { datesList };
};

export default useGenerateDays;
