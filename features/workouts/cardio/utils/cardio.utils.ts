import moment from 'moment';
import { CardioDailyMap, CardioWeeklyMap } from '../types/cardio.types';

export const getCardioForToday = (dailyCardioMap: CardioDailyMap | undefined) => {
  return dailyCardioMap?.[moment().format('YYYY-MM-DD')]?.[0] || null;
};

export const checkIfDoneCardioInSelectedWeek = (stringDate: string, weeklyCardioMap: CardioWeeklyMap) =>
  weeklyCardioMap ? !!weeklyCardioMap[stringDate] : false;
