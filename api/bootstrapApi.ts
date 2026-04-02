import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { showErrorAlert } from '../errors/errorAlerts';
import { BootstrapResponse } from '../types/api/bootstrap/responses';
import { openUpdateModal } from '../utils/imperativeUpdateModal';
import { API_BASE_URL } from './apiConfig';
import buildDpopProof from './DPoP/buildDpopProof';
import { uuidv4 } from 'react-native-compressor';
import { finishHttpErrorSpan, finishHttpResponseSpan, startHttpRequestSpan } from './sentryTracing';
import type { Span } from '@sentry/core';

export type BootstrapPayload = BootstrapResponse;

declare module 'axios' {
  export interface AxiosRequestConfig {
    _sentrySpan?: Span;
    sentryContinueTrace?: boolean;
  }
}

// Use a separate axios instance to avoid circular import
export const bootstrapApi = axios.create({
  baseURL: API_BASE_URL!,
  timeout: 12000,
});

bootstrapApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config._sentrySpan = startHttpRequestSpan(config);
    const url = config.url || '';
    // Adds a request id to each request (on retries - same request ID!)
    if (!config.headers['x-request-id']) {
      config.headers.set('x-request-id', uuidv4());
    }

    console.log('[Bootstrap]:', url);
    config.headers.set('x-app-version', Constants.expoConfig!.version);
    try {
      // Build DPoP for other requests
      const finalUrl = new URL(url, config.baseURL);
      const htu = `${finalUrl.origin}${finalUrl.pathname}`;
      const authHeader = config.headers.Authorization as string | undefined;
      const accessToken = (authHeader?.split(' ')[1] || null) as string | null;
      const dpop = await buildDpopProof(config.method?.toUpperCase() || 'GET', htu, accessToken);
      config.headers.set('dpop', dpop);
    } catch {}
    return config;
  },
  (err) => Promise.reject(err),
);

bootstrapApi.interceptors.response.use(
  (res) => finishHttpResponseSpan(res),
  (err: AxiosError<{ message?: string }>) => {
    finishHttpErrorSpan(err);
    if (err.response?.status === 426) {
      console.log('426');
      openUpdateModal();
    } else {
      showErrorAlert('Error', err.response?.data?.message);
    }
    return Promise.reject(err);
  },
);

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
export async function ensureBootstrap(): Promise<BootstrapPayload> {
  if (payload) return payload;
  if (inflight) {
    return inflight;
  }
  inflight = (async (): Promise<BootstrapPayload> => {
    const res = await bootstrapApi.get<BootstrapPayload>(
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
