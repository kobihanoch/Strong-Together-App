import { DeviceEventEmitter } from 'react-native';

const AUTH_EVENTS = {
  FORCE_LOGOUT: 'auth:force_logout',
} as const;

let forceLogoutEmitted = false;

export const emitForceLogout = () => {
  if (forceLogoutEmitted) return;
  forceLogoutEmitted = true;
  DeviceEventEmitter.emit(AUTH_EVENTS.FORCE_LOGOUT);
  console.log('[Event Emitter]: Logout emitted');
};

/** Allows a future authenticated session to emit one new forced logout. */
export const resetForceLogout = () => {
  forceLogoutEmitted = false;
};

export const onForceLogout = (callback: () => void) => {
  const subscription = DeviceEventEmitter.addListener(AUTH_EVENTS.FORCE_LOGOUT, callback);
  console.log('[Event Emitter]: Logout listener is on');
  return () => subscription.remove();
};
