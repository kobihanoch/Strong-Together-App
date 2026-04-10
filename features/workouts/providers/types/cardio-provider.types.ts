import { AerobicsDailyRecord } from '@strong-together/shared';
import { CardioDailyMap, CardioWeeklyMap } from '../../cardio/types/cardio.types';

export type CardioProviderCachePayload = {
  daily: CardioDailyMap | null;
  weekly: CardioWeeklyMap | null;
};

export interface CardioProviderValue {
  dailyCardioMap: CardioDailyMap | null;
  weeklyCardioMap: CardioWeeklyMap | null;
  setDailyCardioMap: React.Dispatch<React.SetStateAction<CardioDailyMap | null>>;
  setWeeklyCardioMap: React.Dispatch<React.SetStateAction<CardioWeeklyMap | null>>;
  hasDoneCardioToday: boolean;
  cardioForToday: AerobicsDailyRecord | null;
  loading: boolean;
}
