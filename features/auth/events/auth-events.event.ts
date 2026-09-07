import { DeviceEventEmitter } from 'react-native';

const AUTH_EVENTS = {
  FORCE_LOGOUT: 'auth:force_logout',
} as const;

export const emitForceLogout = () => {
  DeviceEventEmitter.emit(AUTH_EVENTS.FORCE_LOGOUT);
  console.log('[Event Emitter]: Logout emitted');
};

export const onForceLogout = (callback: () => void) => {
  const subscription = DeviceEventEmitter.addListener(AUTH_EVENTS.FORCE_LOGOUT, callback);
  console.log('[Event Emitter]: Logout listener is on');
  return () => subscription.remove();
};
