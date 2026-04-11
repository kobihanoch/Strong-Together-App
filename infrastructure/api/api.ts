import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { uuidv4 } from 'react-native-compressor';
import { showErrorAlert } from '../../shared/errors/error-alerts';
import { refreshAndRotateTokens } from '../../features/auth/shared/services/auth.service';
import GlobalAuth from '../../features/auth/shared/utils/auth.utils';
import { openUpdateModal } from '../../shared/utils/imperative-update-modal';
import { saveRefreshToken } from '../../features/auth/shared/utils/token-storage.utils';
import { API_BASE_URL } from './api-url.config';
import { ensureBootstrap, isOpen, isTracked, responseMap } from './bootstrap-api';
import buildDpopProof from './dpop/buildDpopProof';
import calculateJKT from './dpop/calculateJKT';
import { isDeviceOnline, notifyOffline, notifyServerDown } from './helpers/network-check';
import { finishHttpErrorSpan, finishHttpResponseSpan, startHttpRequestSpan } from './tracing/sentry-tracing';
import type { Span } from '@sentry/core';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    isUpgradeRequired?: boolean;
    isNetworkError?: boolean;
    isServerError?: boolean;
    _sentrySpan?: Span;
    sentryContinueTrace?: boolean;
  }

  export interface AxiosError {
    isUpgradeRequired?: boolean;
    isNetworkError?: boolean;
    isServerError?: boolean;
  }
}

const api = axios.create({ baseURL: API_BASE_URL!, timeout: 12000 });

// === WRAP api.get ===

// Store the original axios get
const rawGet = api.get.bind(api);

// Replace api.get to support bootstrap fan-out on first load
api.get = async function wrappedGet<T = unknown, R = AxiosResponse<T>, D = unknown>(
  url: string,
  config?: AxiosRequestConfig<D>,
): Promise<R> {
  // Intercept only during first-load for tracked endpoints
  if (isOpen() && isTracked(url)) {
    try {
      const data = await ensureBootstrap(); // single-flight
      const key = responseMap[url];
      const slice = data?.[key];

      if (slice === undefined) {
        // Fallback: no slice found
        return rawGet(url, config);
      }

      // Return shaped fake axios response
      return {
        data: slice,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || ({} as InternalAxiosRequestConfig),
        request: null,
      } as unknown as R;
    } catch (e) {
      // Fallback on bootstrap error
      console.log('Error:', e);
      return rawGet(url, config);
    }
  }

  // Normal path
  return rawGet(url, config);
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('[API]:', config.url);
    try {
      config._sentrySpan = startHttpRequestSpan(config);
      const url = config.url || '';
      // Adds a request id to each request (on retries - same request ID!)
      if (!config.headers['x-request-id']) {
        config.headers.set('x-request-id', uuidv4());
      }

      if (url.includes('login') || url.includes('oauth/google') || url.includes('oauth/apple')) {
        // Build JKT for tokens signing (login)
        const res = await calculateJKT();
        config.headers.set('dpop-key-binding', res);
      } else {
        // Build DPoP for other requests
        const finalUrl = new URL(url, config.baseURL);
        const htu = `${finalUrl.origin}${finalUrl.pathname}`;
        const authHeader = config.headers.Authorization as string | undefined;
        const accessToken = (authHeader?.split(' ')[1] || null) as string | null;

        const dpop = await buildDpopProof(config.method?.toUpperCase() || 'GET', htu, accessToken);
        config.headers.set('dpop', dpop);
      }
    } catch {}
    config.headers.set('x-app-version', Constants.expoConfig!.version);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Flow:
// Client -> Request -> Server
// CLient <- Response <- Server
//   ---If error---
//   V          V
// SKIP?   DO NOT SKIP?
//   V          V
// Throw      401 => -----Try to refresh---------
//                       V            V
//             Error => Log out /   Good => Call API again
//                       Reject

api.interceptors.response.use(
  (res) => finishHttpResponseSpan(res),
  async (error: AxiosError<{ message?: string }>) => {
    finishHttpErrorSpan(error);
    const original = error.config;
    if (!original) return Promise.reject(error);

    const status = error.response?.status;
    const data = error.response?.data;

    // Update required
    if (status === 426) {
      openUpdateModal(); // <-- imperative show
      error.isUpgradeRequired = true;
      return Promise.reject(error); // always reject
    }

    if (status === 401) {
      console.log('401 from API:', {
        url: original.url,
        method: original.method,
        resp: data,
        authHeader: String(original.headers?.Authorization)?.slice(0, 32) + '...',
      });
    }

    // Detect if network error - no response
    const online = await isDeviceOnline();

    if (!online) {
      notifyOffline();
      error.isNetworkError = true;
      console.log('Offline');
      return Promise.reject(error);
    } else if (!error.response) {
      // Some other fetch/network problem (e.g., DNS, TLS fail)
      notifyServerDown();
      error.isServerError = true;
      console.log('Server down');
      return Promise.reject(error);
    }

    // Don't go for refresh logic for them - just logout or keep logged out and reject
    const url = original?.url || '';
    if (
      original?._retry ||
      url.includes('/api/auth/refresh') ||
      url.includes('/api/auth/login') ||
      url.includes('/api/users/create') ||
      url.includes('/api/auth/logout')
    ) {
      // Some toast to show error
      showErrorAlert('Error', data?.message);
      return Promise.reject(error);
    }

    // If got 401 no access
    if (status === 401) {
      try {
        // Try to refresh
        // Flag for second retry
        original._retry = true;
        const { refreshToken, accessToken } = await refreshAndRotateTokens();
        await saveRefreshToken(refreshToken);
        GlobalAuth.setAccessToken(accessToken);
        original.headers = original.headers || {};
        original.headers.Authorization = `DPoP ${accessToken}`;
        return api(original);
      } catch (refreshErr) {
        // If got here failed at refresh
        const isAuthError = (refreshErr as AxiosError).response?.status === 401;
        if (isAuthError && GlobalAuth.logout) {
          GlobalAuth.logout();
        }
        // Some toast to show error
        showErrorAlert('Error', data?.message || 'Session expired');
        // Block
        return Promise.reject(refreshErr);
      }
    }

    showErrorAlert('Error', data?.message || 'Something went wrong');
    // Bloack all types of error
    return Promise.reject(error);
  },
);

export default api;
