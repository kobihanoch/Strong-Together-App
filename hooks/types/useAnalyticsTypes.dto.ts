import { GetAnalyticsResponse } from '../../types/api/analytics/responses';

export type AnalyticsCachePayload = { _1RM: Analytics1RM; goals: AnalyticsGoals };
export type Analytics1RM = GetAnalyticsResponse['_1RM'];
export type AnalyticsGoals = GetAnalyticsResponse['goals'];
