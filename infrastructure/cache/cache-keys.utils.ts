import { CACHE_VERSION } from './cache.constants';

// ----- Simple key builders (uppercase "CACHE:*") -----


export const keyStartWorkout = (userId: string): string => `CACHE:STARTWORKOUT:${userId}:${CACHE_VERSION}`;
