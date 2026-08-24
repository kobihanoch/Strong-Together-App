import type { UserAerobicsResponse } from '@strong-together/shared';

export type CardioDailyMap = UserAerobicsResponse['daily'];
export type CardioWeeklyMap = UserAerobicsResponse['weekly'];
export type CardioDailyRecord = CardioDailyMap[string][number];
export type CardioWeeklyData = CardioWeeklyMap[string];
export type CardioWeeklyRecord = CardioWeeklyData['records'][number];
