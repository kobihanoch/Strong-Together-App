import { Span } from '@sentry/react-native';
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    isUpgradeRequired?: boolean;
    isNetworkError?: boolean;
    isServerError?: boolean;
    _sentrySpan?: Span;
    sentryContinueTrace?: boolean;
    apiMode?: 'guest' | 'user';
  }

  export interface AxiosError {
    isUpgradeRequired?: boolean;
    isNetworkError?: boolean;
    isServerError?: boolean;
  }
}
