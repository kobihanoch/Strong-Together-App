import { GetWorkoutStatisticsResponse } from '@strong-together/shared';
import type useHomeDashboard from '../hooks/use-home-dashboard.hook';

export type HomeDashboardStats = GetWorkoutStatisticsResponse;
export type HomeDashboardReturn = ReturnType<typeof useHomeDashboard>;
export type HomeDashboardData = HomeDashboardReturn['data'];
