export const workoutScheduleQueryKeys = {
  all: ['workout-schedules'] as const,
  byUser: (userId: string | null) => [...workoutScheduleQueryKeys.all, userId] as const,
};
