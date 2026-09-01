import type { GetAerobicHistoryResponse } from '@strong-together/shared';

export type CardioMaps = GetAerobicHistoryResponse;
export type CardioDailyMap = GetAerobicHistoryResponse['daily'];
export type CardioWeeklyMap = GetAerobicHistoryResponse['weekly'];
export type CardioDailyRecord = CardioDailyMap[string][number];
export type CardioWeeklyData = CardioWeeklyMap[string];
export type CardioWeeklyRecord = CardioWeeklyData['records'][number];
