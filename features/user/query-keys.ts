export const userQueryKeys = {
  all: ['user'] as const,
  byUser: (userId: string | null) => [...userQueryKeys.all, userId] as const,
};
