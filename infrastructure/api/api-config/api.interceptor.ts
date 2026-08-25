import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { showErrorAlert } from '../../../shared/alerts/error-alerts';
import { handle401, handleNetworkProblems, handleUpdateRequired } from './helpers/error-handlers';
import { finishHttpErrorSpan, finishHttpResponseSpan } from '../tracing/sentry-tracing';
import { isDeviceOnline } from './helpers/network-check';
import { addAppVersionHeader, addDpopHeader, addTracingHeader } from './helpers/header-injections';

// Initalize interceptors
export const initializeRequestInterceptor = (api: AxiosInstance) =>
  // Request interceptor
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const url = config.url;
      if (!config._servedFromBootstrap) console.log('[API]:', url);
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
    (error: unknown) => {
      return Promise.reject(error);
    },
  );

export const initializeResponseInterceptor = (api: AxiosInstance) =>
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
    (res: AxiosResponse) => finishHttpResponseSpan(res),
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
        return await handle401(api, error);
      }

      // Fallback
      showErrorAlert('Error', data?.message || 'Something went wrong');
      // Bloack all types of error
      return Promise.reject(error);
    },
  );

export const initializeInterceptors = (api: AxiosInstance) => {
  initializeRequestInterceptor(api);
  initializeResponseInterceptor(api);
};
