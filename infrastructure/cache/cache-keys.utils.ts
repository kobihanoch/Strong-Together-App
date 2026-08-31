import { CACHE_VERSION } from './cache.constants';

// ----- Simple key builders (uppercase "CACHE:*") -----

export const keyAnalytics = (userId: string): string => `CACHE:ANALYTICS:${userId}:${CACHE_VERSION}`;

export const keyStartWorkout = (userId: string): string => `CACHE:STARTWORKOUT:${userId}:${CACHE_VERSION}`;
