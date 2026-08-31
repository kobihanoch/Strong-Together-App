import { GetExerciseTrackingStatsResponse } from '@strong-together/shared';
import type useHomeDashboard from '../hooks/use-home-dashboard.hook';

export type HomeDashboardStats = GetExerciseTrackingStatsResponse;
export type HomeDashboardReturn = ReturnType<typeof useHomeDashboard>;
export type HomeDashboardData = HomeDashboardReturn['data'];
