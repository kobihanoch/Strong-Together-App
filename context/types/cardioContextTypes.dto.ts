import { UserAerobicsResponse } from '@strong-together/shared';
import { AerobicsDailyRecord } from '@strong-together/shared';

export type CardioContextCachePayload = {
  daily: CardioContextDailyMap | null;
  weekly: CardioContextWeeklyMap | null;
};
export type CardioContextDailyMap = UserAerobicsResponse['daily'];
export type CardioContextWeeklyMap = UserAerobicsResponse['weekly'];

export interface CardioContextValue {
  dailyCardioMap: CardioContextDailyMap | null;
  weeklyCardioMap: CardioContextWeeklyMap | null;
  setDailyCardioMap: React.Dispatch<React.SetStateAction<CardioContextDailyMap | null>>;
  setWeeklyCardioMap: React.Dispatch<React.SetStateAction<CardioContextWeeklyMap | null>>;
  hasDoneCardioToday: boolean;
  cardioForToday: AerobicsDailyRecord | null;
  loading: boolean;
}
