import api from '../api/api';
import { GetAnalyticsResponse } from '../types/api/analytics/responses';

export const getTrackingAnalytics = async (): Promise<GetAnalyticsResponse> => {
  const { data } = await api.get<GetAnalyticsResponse>('/api/analytics/get');
  return data;
};
