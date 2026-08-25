import type { UserAerobicsResponse } from '@strong-together/shared';

export type CardioDailyMap = UserAerobicsResponse['daily'];
export type CardioWeeklyMap = UserAerobicsResponse['weekly'];
export type CardioDailyRecord = CardioDailyMap[string][number];
export type CardioWeeklyData = CardioWeeklyMap[string];
export type CardioWeeklyRecord = CardioWeeklyData['records'][number];

export interface CardioProviderValue {
  dailyCardioMap: CardioDailyMap | null;
  weeklyCardioMap: CardioWeeklyMap | null;
  setDailyCardioMap: React.Dispatch<React.SetStateAction<CardioDailyMap | undefined>>;
  setWeeklyCardioMap: React.Dispatch<React.SetStateAction<CardioWeeklyMap | undefined>>;
  hasDoneCardioToday: boolean;
  cardioForToday: CardioDailyRecord | null;
  loading: boolean;
}
