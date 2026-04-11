import { CACHE_VERSION } from './cache.utils';

// ----- Simple key builders (uppercase "CACHE:*") -----
export const keyWorkoutPlan = (userId: string): string => `CACHE:WORKOUTPLAN:${userId}:${CACHE_VERSION}`;
export const keyAnalytics = (userId: string): string => `CACHE:ANALYTICS:${userId}:${CACHE_VERSION}`;
export const keyTracking = (userId: string, days: number = 45): string =>
  `CACHE:TRACKING:${userId}:${days}:${CACHE_VERSION}`;
export const keyAuth = (userId: string): string => `CACHE:AUTH:${userId}:${CACHE_VERSION}`;
export const keyInbox = (userId: string): string => `CACHE:INBOX:${userId}:${CACHE_VERSION}`;
export const keyCardio = (userId: string): string => `CACHE:CARDIO:${userId}:${CACHE_VERSION}`;

export const keyStartWorkout = (userId: string): string => `CACHE:STARTWORKOUT:${userId}:${CACHE_VERSION}`;
