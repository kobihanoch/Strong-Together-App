import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Versions for cache
const META_VERSION_KEY = "CACHE:__VERSION__";
export const CACHE_VERSION = Constants.expoConfig.version;

// ----- TTL helpers -----
export const TTL_48H = 48 * 60 * 60; // seconds
export const TTL_36H = 36 * 60 * 60; // seconds

// ----- Simple key builders (uppercase "CACHE:*") -----

export const keyWorkoutPlan = (userId) =>
  `CACHE:WORKOUTPLAN:${userId}:${CACHE_VERSION}`;
export const keyAnalytics = (userId) =>
  `CACHE:ANALYTICS:${userId}:${CACHE_VERSION}`;
export const keyTracking = (userId, days) =>
  `CACHE:TRACKING:${userId}:${days}:${CACHE_VERSION}`;
export const keyAuth = (userId) => `CACHE:AUTH:${userId}:${CACHE_VERSION}`; // optional
export const keyInbox = (userId) => `CACHE:INBOX:${userId}:${CACHE_VERSION}`; // optional

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

export async function cacheHousekeepingOnBoot() {
  try {
    const prev = await AsyncStorage.getItem(META_VERSION_KEY);
    if (prev === CACHE_VERSION) return; // already cleaned for this version

    const keys = await AsyncStorage.getAllKeys();
    const stale = keys.filter(
      (k) => k.startsWith("CACHE:") && !k.endsWith(`:${CACHE_VERSION}`)
    );

    if (stale.length) {
      const CHUNK = 100;
      for (let i = 0; i < stale.length; i += CHUNK) {
        await AsyncStorage.multiRemove(stale.slice(i, i + CHUNK));
      }
    }
    await AsyncStorage.setItem(META_VERSION_KEY, CACHE_VERSION);
    console.log(
      "[Cache]: Housekeeping suscceeded. App version:",
      CACHE_VERSION,
      "prev version:",
      prev
    );
  } catch (e) {
    console.warn("[Cache] Housekeeping failed:", e?.message);
  }
}
