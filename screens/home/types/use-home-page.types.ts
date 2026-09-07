import type useHomeScreen from '../hooks/use-home-screen.hook';

export type HomeDashboardReturn = ReturnType<typeof useHomeScreen>;
export type HomeDashboardData = HomeDashboardReturn['data'];
