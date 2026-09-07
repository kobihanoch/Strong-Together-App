import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { saveUserId } from '../../features/auth/utils/token-storage.utils';

// Versions for cache
export const CACHE_VERSION = Constants.expoConfig!.version;

/**
 * @deprecated This function is kept as a temporary grace mechanism for the next release.
 * Legacy AsyncStorage cache keys starting with 'CACHE:' will be cleaned up.
 * Do not use for new features. Use TanStack Query / Persister instead.
 */
export async function cacheHousekeepingOnBoot(): Promise<void> {
  try {
    // Stale bootstrap for clean move to v6.0.0
    const rawStaleUserId = await AsyncStorage.getItem('CACHE:USER_ID');
    if (rawStaleUserId) {
      const parsed = JSON.parse(rawStaleUserId) as {
        data?: string;
        exp?: number;
      };

      if (typeof parsed.data === 'string') {
        await saveUserId(parsed.data);
      }
    }

    // Removing stale cache from versions under v6.0.0
    const keys = await AsyncStorage.getAllKeys();
    const stale = keys.filter((key) => key.startsWith('CACHE:') || key === '__VERSION__');

    if (stale.length) {
      const CHUNK = 100;
      for (let i = 0; i < stale.length; i += CHUNK) {
        await AsyncStorage.multiRemove(stale.slice(i, i + CHUNK));
      }
    }
    console.log('[Cache]: Legacy cache housekeeping succeeded for the last time.');
  } catch (e) {
    if (e instanceof Error) console.warn('[Cache] Housekeeping failed:', e?.message);
  }
}
