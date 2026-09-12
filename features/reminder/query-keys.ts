export const reminderQueryKeys = {
  all: ['reminder'] as const,
  byUser: (userId: string | null) => [...reminderQueryKeys.all, userId] as const,
};
