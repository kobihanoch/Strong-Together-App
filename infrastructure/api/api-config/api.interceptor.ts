import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showErrorAlert } from '../../../shared/errors/error-alerts';
import { handle401, handleNetworkProblems, handleUpdateRequired } from './helpers/error-handlers';
import { finishHttpErrorSpan, finishHttpResponseSpan } from '../tracing/sentry-tracing';
import api from './api';
import { ensureBootstrap, isOpen, isTracked, responseMap } from './bootstrap';
import { isDeviceOnline } from './helpers/network-check';
import { addAppVersionHeader, addDpopHeader, addTracingHeader } from './helpers/header-injections';

// Initalize interceptors
export const initializeRequestInterceptor = () =>
  // Request interceptor
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const url = config.url;
      console.log('[API]:', url);
      const apiMode = config.apiMode || 'user';

      try {
        // Trace injections
        addTracingHeader(config);
        // App version injection
        addAppVersionHeader(config);
        // DpoP injection
        await addDpopHeader(apiMode, config);
      } catch {}

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

export const initializeResponseInterceptor = () =>
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

      const status = error.response?.status;
      const data = error.response?.data;

      // Update required
      if (status === 426) {
        return handleUpdateRequired(error);
      }

      // Network errors
      const online = await isDeviceOnline();
      if (!online || !error.response) return handleNetworkProblems(error, online);

      const original = error.config;
      if (!original) return Promise.reject(error);

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

      // If got 401
      if (status === 401) {
        return await handle401(error);
      }

      // Fallback
      showErrorAlert('Error', data?.message || 'Something went wrong');
      // Bloack all types of error
      return Promise.reject(error);
    },
  );

// Bootstrap inteceptor
export const initializeBootstrapInterceptor = () =>
  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (isOpen() && isTracked(config.url!)) {
      const data = await ensureBootstrap();
      const key = responseMap[config.url!];
      const slice = data?.[key];

      // Instead of going out with a network call, use adapter function
      if (slice !== undefined) {
        config.adapter = async () => ({
          data: slice,
          status: 200,
          statusText: 'OK (From Bootstrap)',
          headers: {},
          config,
        });
      }
    }
    return config;
  });
