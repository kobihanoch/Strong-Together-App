import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Versions for cache
export const CACHE_VERSION = Constants.expoConfig!.version;

/**
 * @deprecated This function is kept as a temporary grace mechanism for the next release.
 * Legacy AsyncStorage cache keys starting with 'CACHE:' will be cleaned up.
 * Do not use for new features. Use TanStack Query / Persister instead.
 */
export async function cacheHousekeepingOnBoot(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    // Everything out of user id for soft login after udpate
    const stale = keys.filter((k) => (k.startsWith('CACHE:') && k !== 'CACHE:USER_ID') || k === '__VERSION__');

    if (stale.length) {
      const CHUNK = 100;
      for (let i = 0; i < stale.length; i += CHUNK) {
        await AsyncStorage.multiRemove(stale.slice(i, i + CHUNK));
      }
    }
    console.log('[Cache]: Housekeeping suscceeded. User id kept.');
  } catch (e) {
    if (e instanceof Error) console.warn('[Cache] Housekeeping failed:', e?.message);
  }
}
