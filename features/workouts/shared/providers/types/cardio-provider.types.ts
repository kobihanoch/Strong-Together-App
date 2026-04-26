import { AerobicsDailyRecord } from '@strong-together/shared';
import { CardioDailyMap, CardioWeeklyMap } from '../../../cardio/types/cardio.types';

export interface CardioProviderValue {
  dailyCardioMap: CardioDailyMap | null;
  weeklyCardioMap: CardioWeeklyMap | null;
  setDailyCardioMap: React.Dispatch<React.SetStateAction<CardioDailyMap | undefined>>;
  setWeeklyCardioMap: React.Dispatch<React.SetStateAction<CardioWeeklyMap | undefined>>;
  hasDoneCardioToday: boolean;
  cardioForToday: AerobicsDailyRecord | null;
  loading: boolean;
}
