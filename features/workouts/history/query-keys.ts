export const workoutHistoryQueryKeys = {
  all: ['workout-history'] as const,
  byUser: (userId: string | null) => [...workoutHistoryQueryKeys.all, userId] as const,
};

export const exerciseHistoryQueryKeys = {
  all: ['exercise-history'] as const,
  byUser: (userId: string | null) => [...exerciseHistoryQueryKeys.all, userId] as const,
};

export const prHistoryQueryKeys = {
  all: ['pr-history'] as const,
  byUser: (userId: string | null) => [...prHistoryQueryKeys.all, userId] as const,
};
