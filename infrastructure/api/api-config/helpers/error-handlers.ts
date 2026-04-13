import { AxiosError } from 'axios';
import { refreshAndRotateTokens } from '../../../../features/auth/shared/services/auth.service';
import GlobalAuth from '../../../../features/auth/shared/utils/auth.utils';
import { saveRefreshToken } from '../../../../features/auth/shared/utils/token-storage.utils';
import { showErrorAlert } from '../../../../shared/errors/error-alerts';
import { openUpdateModal } from '../../../../shared/utils/imperative-update-modal';
import api from '../api';
import { notifyOffline, notifyServerDown } from './network-check';

export const handleUpdateRequired = (error: AxiosError) => {
  openUpdateModal(); // <-- imperative show
  error.isUpgradeRequired = true;
  return Promise.reject(error); // always reject
};

export const handleNetworkProblems = async (error: AxiosError, online: boolean) => {
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
};

export const handle401 = async (error: AxiosError<{ message?: string }>) => {
  const firstRequest = error.config!;
  const data = error.response?.data;

  console.log('401 from API:', {
    url: firstRequest.url,
    method: firstRequest.method,
    resp: data,
    authHeader: String(firstRequest.headers?.Authorization)?.slice(0, 32) + '...',
  });
  try {
    // Try to refresh
    // Flag for second retry
    firstRequest._retry = true;
    const { refreshToken, accessToken } = await refreshAndRotateTokens();
    await saveRefreshToken(refreshToken);
    GlobalAuth.setAccessToken(accessToken);
    firstRequest.headers = firstRequest.headers || {};
    firstRequest.headers.Authorization = `DPoP ${accessToken}`;
    return api(firstRequest);
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
};
