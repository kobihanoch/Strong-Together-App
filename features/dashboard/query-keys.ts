export const dashboardQueryKeys = {
  all: ['home-dashboard'] as const,
  byUser: (userId: string | null) => [...dashboardQueryKeys.all, userId] as const,
};
