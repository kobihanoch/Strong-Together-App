import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Versions for cache
export const CACHE_VERSION = Constants.expoConfig!.version;

/** @deprecated Retained temporarily for the active-workout cache migration. */
export async function cacheSetJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify({ data: value }));
}

/** @deprecated Retained temporarily for the active-workout cache migration. */
export async function cacheGetJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { data: T };
    return parsed.data;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}

/** @deprecated Retained temporarily for the active-workout cache migration. */
export async function cacheDeleteKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/**
 * @deprecated This function is kept as a temporary grace mechanism for the next release.
 * Legacy AsyncStorage cache keys starting with 'CACHE:' will be cleaned up.
 * Do not use for new features. Use TanStack Query / Persister instead.
 */
export async function cacheHousekeepingOnBoot(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const stale = keys.filter((key) => key.startsWith('CACHE:') || key === '__VERSION__');

    if (stale.length) {
      const CHUNK = 100;
      for (let i = 0; i < stale.length; i += CHUNK) {
        await AsyncStorage.multiRemove(stale.slice(i, i + CHUNK));
      }
    }
    console.log('[Cache]: Legacy cache housekeeping succeeded.');
  } catch (e) {
    if (e instanceof Error) console.warn('[Cache] Housekeeping failed:', e?.message);
  }
}
