import { InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { uuidv4 } from 'react-native-compressor';
import buildDpopProof from '../../dpop/buildDpopProof';
import calculateJKT from '../../dpop/calculateJKT';
import { startHttpRequestSpan } from '../../tracing/sentry-tracing';

export const addDpopHeader = async (apiMode: 'guest' | 'user', config: InternalAxiosRequestConfig) => {
  if (apiMode === 'guest') {
    // Build JKT for tokens signing (login)
    const res = await calculateJKT();
    config.headers.set('dpop-key-binding', res);
  } else {
    // Build DPoP for other requests
    const finalUrl = new URL(config.url!, config.baseURL);
    const htu = `${finalUrl.origin}${finalUrl.pathname}`;
    const authHeader = config.headers.Authorization as string | undefined;
    const accessToken = (authHeader?.split(' ')[1] || null) as string | null;

    const dpop = await buildDpopProof(config.method?.toUpperCase() || 'GET', htu, accessToken);
    config.headers.set('dpop', dpop);
  }
};

export const addTracingHeader = (config: InternalAxiosRequestConfig) => {
  config._sentrySpan = startHttpRequestSpan(config);
  // Adds a request id to each request (on retries - same request ID!)
  if (!config.headers['x-request-id']) {
    config.headers.set('x-request-id', uuidv4());
  }
};

export const addAppVersionHeader = (config: InternalAxiosRequestConfig) => {
  const appVersion = Constants.expoConfig!.version;
  config.headers.set('x-app-version', appVersion);
};
