import type useHomeDashboard from '../hooks/use-home.hook';

export type HomeDashboardReturn = ReturnType<typeof useHomeDashboard>;
export type HomeDashboardData = HomeDashboardReturn['data'];
