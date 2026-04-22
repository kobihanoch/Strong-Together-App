import { generateTraceId, getActiveSpan, getCurrentScope, getTraceData } from '@sentry/core';
import * as Sentry from '@sentry/react-native';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

function buildRequestName(method: string | undefined, url: string): string {
  return `${(method || 'GET').toUpperCase()} ${url}`;
}

export function startHttpRequestSpan(config: InternalAxiosRequestConfig): Sentry.Span {
  const requestUrl = new URL(config.url || '', config.baseURL).toString();
  const continueCurrentTrace = config.sentryContinueTrace === true;
  const requestScope = continueCurrentTrace ? getCurrentScope() : getCurrentScope().clone();

  if (!continueCurrentTrace) {
    requestScope.setPropagationContext({
      traceId: generateTraceId(),
      sampleRand: Math.random(),
    });
  }

  const parentSpan = continueCurrentTrace ? getActiveSpan() || null : null;

  const span = Sentry.startInactiveSpan({
    name: buildRequestName(config.method, config.url || requestUrl),
    op: 'http.client',
    forceTransaction: true,
    parentSpan,
    scope: requestScope,
    attributes: {
      'http.method': (config.method || 'GET').toUpperCase(),
      'http.url': requestUrl,
      'server.address': new URL(requestUrl).host,
      'sentry.origin': 'manual.http.axios',
    },
  });

  const traceData = getTraceData({
    span,
    scope: requestScope,
    propagateTraceparent: true,
  });

  if (traceData['sentry-trace']) {
    config.headers.set('sentry-trace', traceData['sentry-trace']);
  }

  if (traceData.baggage) {
    config.headers.set('baggage', traceData.baggage);
  }

  if (traceData.traceparent) {
    config.headers.set('traceparent', traceData.traceparent);
  }

  return span;
}

export function finishHttpResponseSpan(response: AxiosResponse): AxiosResponse {
  response.config._sentrySpan?.setAttribute('http.status_code', response.status);
  response.config._sentrySpan?.end();
  return response;
}

export function finishHttpErrorSpan(error: AxiosError): void {
  const span = error.config?._sentrySpan;
  if (!span) return;

  const statusCode = error.response?.status;

  if (statusCode) {
    span.setAttribute('http.status_code', statusCode);
  }

  if (error.message) {
    span.setAttribute('error.message', error.message);
  }

  span.end();
}
