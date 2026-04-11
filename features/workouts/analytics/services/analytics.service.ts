import api from '../../../../api/api';
import { GetAnalyticsResponse } from '@strong-together/shared';

export const getTrackingAnalytics = async (): Promise<GetAnalyticsResponse> => {
  const { data } = await api.get<GetAnalyticsResponse>('/api/analytics/get');
  return data;
};
