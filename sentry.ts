import * as Sentry from '@sentry/react-native';
import type { EventHint } from '@sentry/types';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';

export const isSentryEnabled = environment === 'production' && Boolean(dsn);

function isUnauthorizedError(hint: EventHint): boolean {
  const originalException = hint.originalException;

  if (typeof originalException === 'object' && originalException !== null) {
    const maybeAxiosError = originalException as {
      response?: { status?: number };
      status?: number;
      message?: string;
    };

    if (maybeAxiosError.response?.status === 401 || maybeAxiosError.status === 401) {
      return true;
    }

    if (typeof maybeAxiosError.message === 'string' && maybeAxiosError.message.includes('401')) {
      return true;
    }
  }

  if (typeof originalException === 'string' && originalException.includes('401')) {
    return true;
  }

  return false;
}

Sentry.init({
  dsn,
  enabled: isSentryEnabled,
  environment,
  debug: false,
  beforeSend(event, hint) {
    if (isUnauthorizedError(hint)) {
      return null;
    }

    return event;
  },
});

export default Sentry;
