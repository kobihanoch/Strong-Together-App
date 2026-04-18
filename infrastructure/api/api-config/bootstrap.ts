import { BootstrapResponse } from '@strong-together/shared';
import { AxiosInstance } from 'axios';

export type BootstrapPayload = BootstrapResponse;

let inflight: Promise<BootstrapPayload> | null = null; // shared promise while /bootstrap is in flight
let payload: BootstrapPayload | null = null; // cached /bootstrap response
let closed = false; // once true, we stop intercepting
let graceT: ReturnType<typeof setTimeout> | null = null; // short grace so late requests still get slices

export const responseMap: Record<string, keyof BootstrapPayload> = {
  '/api/users/get': 'user',
  '/api/workouts/gettracking': 'tracking',
  '/api/aerobics/get': 'aerobics',
  '/api/messages/getmessages': 'messages',
  '/api/workouts/getworkout': 'workout',
};

// If url is tracked inside bootstrap
export const isTracked = (url: string): boolean => Object.prototype.hasOwnProperty.call(responseMap, url);

// Interception is open until we mark it closed
export const isOpen = (): boolean => !closed;

// If bootstrap payload has been received yet
export const hasBootstrapPayload = (): boolean => !!payload;

// Single-flight bootstrap fetch
export async function ensureBootstrap(api: AxiosInstance): Promise<BootstrapPayload> {
  if (payload) return payload;
  if (inflight) {
    return inflight;
  }
  inflight = (async (): Promise<BootstrapPayload> => {
    const res = await api.get<BootstrapPayload>(
      `/api/bootstrap/get?tz=${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
    ); // real server call
    payload = res?.data || {};

    // Give a short grace window so "just-arrived" requests still use the payload
    if (graceT) clearTimeout(graceT);
    graceT = setTimeout(() => {
      closed = true;
    }, 150);

    inflight = null;
    return payload;
  })();

  return inflight;
}

// Optional: reset on logout/account switch
export function resetBootstrap(): void {
  inflight = null;
  payload = null;
  closed = false;
  if (graceT) {
    clearTimeout(graceT);
    graceT = null;
  }
}
