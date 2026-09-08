import { AxiosError, AxiosInstance } from 'axios';
import { refreshSessionOnce } from '../../../../features/auth/services/auth.service';
import { showErrorAlert } from '../../../../shared/alerts/error-alerts';
import { openUpdateModal } from '../../../../shared/utils/imperative-update-modal';
import { notifyOffline, notifyServerDown } from './network-check';
import { emitForceLogout } from '../../../../features/auth/events/auth-events.event';

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

export const handle401 = async (api: AxiosInstance, error: AxiosError<{ message?: string }>) => {
  const firstRequest = error.config!;
  const data = error.response?.data;

  console.log('401 from API:', {
    url: firstRequest.url,
    method: firstRequest.method,
    resp: data,
    authHeader: String(firstRequest.headers?.Authorization)?.slice(0, 32) + '...',
  });
  try {
    // Retry once with an access token that another completed refresh may have
    // already installed while this request was in flight.
    firstRequest._retry = true;
    const currentAuthorization = api.defaults.headers.common.Authorization;
    if (currentAuthorization && String(firstRequest.headers?.Authorization) !== String(currentAuthorization)) {
      firstRequest.headers = firstRequest.headers || {};
      firstRequest.headers.Authorization = currentAuthorization;
      return api(firstRequest);
    }

    // Otherwise join the single app-wide refresh transaction.
    const { accessToken } = await refreshSessionOnce();
    firstRequest.headers = firstRequest.headers || {};
    firstRequest.headers.Authorization = `DPoP ${accessToken}`;
    return api(firstRequest);
  } catch (refreshErr) {
    const error = refreshErr as AxiosError;
    const shouldPreserveWorkoutSession = error.isUpgradeRequired || error.isNetworkError || error.isServerError;

    if (!shouldPreserveWorkoutSession) {
      emitForceLogout();
    }
    // Some toast to show error
    showErrorAlert('Error', data?.message || 'Session expired');
    // Block
    return Promise.reject(refreshErr);
  }
};
