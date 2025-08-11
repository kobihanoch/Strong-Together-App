// tokenStore.js
import * as SecureStore from "expo-secure-store";

export async function saveRefreshToken(rt) {
  await SecureStore.setItemAsync("refresh_token", rt);
}
export async function getRefreshToken() {
  return SecureStore.getItemAsync("refresh_token");
}
export async function clearRefreshToken() {
  await SecureStore.deleteItemAsync("refresh_token");
}
