export const cardioQueryKeys = {
  all: ['cardio-maps'] as const,
  byUser: (userId: string | null) => [...cardioQueryKeys.all, userId] as const,
};
