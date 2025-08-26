import AsyncStorage from "@react-native-async-storage/async-storage";

// ----- TTL helpers -----
export const TTL_48H = 48 * 60 * 60; // seconds
export const TTL_36H = 36 * 60 * 60; // seconds

// ----- Simple key builders (uppercase "CACHE:*") -----
export const keyWorkoutPlan = (userId) => `CACHE:WORKOUTPLAN:${userId}`;
export const keyAnalytics = (userId) => `CACHE:ANALYTICS:${userId}`;
export const keyTracking = (userId, days) => `CACHE:TRACKING:${userId}:${days}`;
export const keyAuth = (userId) => `CACHE:AUTH:${userId}`; // optional
export const keyInbox = (userId) => `CACHE:INBOX:${userId}`; // optional

/**
 * Save JSON value under a key with TTL (in seconds).
 * Overwrites any existing value for the same key.
 */
export async function cacheSetJSON(key, value, ttlSec) {
  if (!Number.isFinite(ttlSec) || ttlSec <= 0) {
    throw new Error("ttlSec must be a positive number (in seconds)");
  }
  const payload = JSON.stringify({
    data: value,
    exp: Date.now() + ttlSec * 1000, // absolute expiry in ms
  });
  await AsyncStorage.setItem(key, payload);
}

/**
 * Get JSON value by key. Returns null if missing or expired.
 */
export async function cacheGetJSON(key) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj.exp !== "number") return null;
    if (Date.now() > obj.exp) {
      // Expired: remove and return null
      await AsyncStorage.removeItem(key);
      return null;
    }
    return obj.data;
  } catch {
    // Corrupted value: remove and treat as miss
    await AsyncStorage.removeItem(key);
    return null;
  }
}

/**
 * Delete a cached entry by exact key.
 */
export async function cacheDeleteKey(key) {
  await AsyncStorage.removeItem(key);
}

// Delete all user's cache
export async function cacheDeleteAllCache() {
  const allKeys = await AsyncStorage.getAllKeys();
  const toDelete = allKeys.filter((k) => k.startsWith("CACHE:"));
  if (!toDelete.length) return;

  const CHUNK = 100;
  for (let i = 0; i < toDelete.length; i += CHUNK) {
    await AsyncStorage.multiRemove(toDelete.slice(i, i + CHUNK));
  }
  console.log("Cache delted!");
}
