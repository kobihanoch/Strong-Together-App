// tokenStore.js
import * as SecureStore from 'expo-secure-store';

const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'authenticated_user_id';

export async function saveRefreshToken(rt: string) {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, rt);
}
export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}
export async function clearRefreshToken() {
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveUserId(userId: string) {
  await SecureStore.setItemAsync(USER_ID_KEY, userId);
}

export async function getUserId() {
  return SecureStore.getItemAsync(USER_ID_KEY);
}

export async function clearAuthStorage() {
  await Promise.all([SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY), SecureStore.deleteItemAsync(USER_ID_KEY)]);
}
