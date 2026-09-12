export const messagesQueryKeys = {
  all: ['messages'] as const,
  byUser: (userId: string | null) => [...messagesQueryKeys.all, userId] as const,
};
