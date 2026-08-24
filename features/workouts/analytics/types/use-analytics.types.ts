import type { GetAnalyticsResponse } from '@strong-together/shared';

export type Analytics1RM = GetAnalyticsResponse['oneRepMaxes'];
export type AnalyticsGoals = GetAnalyticsResponse['goals'];
export type AnalyticsRmRecord = Analytics1RM[string];
export type AnalyticsAdherenceStats = AnalyticsGoals[string][string];
