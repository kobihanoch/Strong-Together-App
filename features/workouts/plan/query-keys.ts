export const workoutPlanQueryKeys = {
  all: ['workout-plan'] as const,
  byUser: (userId: string | null) => [...workoutPlanQueryKeys.all, userId] as const,
};

export const exercisesQueryKeys = {
  all: ['exercises'] as const,
  byUser: (userId: string | null) => [...exercisesQueryKeys.all, userId] as const,
};
