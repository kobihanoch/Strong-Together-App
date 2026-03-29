/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    getAllKeys: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: 'test-version',
    },
  },
}));

import { keyAuth, TTL_48H } from '../../cache/cacheUtils';

const mockUseGetCache = jest.fn();
const mockUseUpdateCache = jest.fn();

jest.mock('../useGetCache', () => ({
  __esModule: true,
  default: (key: string | null) => mockUseGetCache(key),
}));

jest.mock('../useUpdateCache', () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseUpdateCache(...args),
}));

import useCacheAndFetch from '../useCacheAndFetch';

type CachePayload = { source: 'cache'; value: string };
type ApiPayload = { source: 'api'; value: string };

const createUser = (id: string | null = 'user-1') => (id ? { id } : ({ id: null } as { id: null }));

describe('useCacheAndFetch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetCache.mockReturnValue({
      cached: null,
      hydrated: false,
    });
  });

  it('does not build a usable cache flow when user id is missing', () => {
    const fetchFn = jest.fn<() => Promise<ApiPayload>>();
    const onDataFn = jest.fn<(data: CachePayload | ApiPayload) => void>();

    const { result } = renderHook(() =>
      useCacheAndFetch(
        createUser(null),
        keyAuth,
        false,
        fetchFn,
        onDataFn,
        null,
        'Auth Context',
      ),
    );

    expect(mockUseGetCache).toHaveBeenCalledWith(null);
    expect(mockUseUpdateCache).toHaveBeenCalledWith(
      'Auth Context',
      null,
      null,
      TTL_48H,
      false,
    );
    expect(fetchFn).not.toHaveBeenCalled();
    expect(onDataFn).not.toHaveBeenCalled();
    expect(result.current).toEqual({
      data: null,
      loading: false,
      cacheKnown: false,
    });
  });

  it('hydrates from cache before any server validation', async () => {
    const cachedPayload: CachePayload = { source: 'cache', value: 'cached user' };
    const fetchFn = jest.fn<() => Promise<ApiPayload>>();
    const onDataFn = jest.fn<(data: CachePayload | ApiPayload) => void>();

    mockUseGetCache.mockReturnValue({
      cached: cachedPayload,
      hydrated: true,
    });

    const { result } = renderHook(() =>
      useCacheAndFetch(
        createUser(),
        keyAuth,
        false,
        fetchFn,
        onDataFn,
        cachedPayload,
        'Auth Context',
      ),
    );

    await waitFor(() => {
      expect(onDataFn).toHaveBeenCalledWith(cachedPayload);
    });

    expect(fetchFn).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(cachedPayload);
    expect(result.current.loading).toBe(false);
    expect(result.current.cacheKnown).toBe(true);
  });

  it('enters loading state when cache is hydrated but empty', async () => {
    const fetchFn = jest.fn<() => Promise<ApiPayload>>();
    const onDataFn = jest.fn<(data: CachePayload | ApiPayload) => void>();

    mockUseGetCache.mockReturnValue({
      cached: null,
      hydrated: true,
    });

    const { result } = renderHook(() =>
      useCacheAndFetch(
        createUser(),
        keyAuth,
        false,
        fetchFn,
        onDataFn,
        null,
        'Auth Context',
      ),
    );

    await waitFor(() => {
      expect(result.current.cacheKnown).toBe(true);
    });

    expect(onDataFn).not.toHaveBeenCalled();
    expect(fetchFn).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it('fetches from the API only after cache is known and validation is enabled', async () => {
    const apiPayload: ApiPayload = { source: 'api', value: 'fresh user' };
    const fetchFn = jest.fn<() => Promise<ApiPayload>>().mockResolvedValue(apiPayload);
    const onDataFn = jest.fn<(data: CachePayload | ApiPayload) => void>();

    mockUseGetCache.mockReturnValue({
      cached: null,
      hydrated: true,
    });

    const { result } = renderHook(() =>
      useCacheAndFetch(
        createUser(),
        keyAuth,
        true,
        fetchFn,
        onDataFn,
        apiPayload,
        'Auth Context',
      ),
    );

    await waitFor(() => {
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(onDataFn).toHaveBeenCalledWith(apiPayload);
    });

    expect(result.current.data).toEqual(apiPayload);
    expect(result.current.loading).toBe(false);
    expect(result.current.cacheKnown).toBe(true);
  });

  it('enables cache updates only after API hydration succeeded', async () => {
    const apiPayload: ApiPayload = { source: 'api', value: 'fresh analytics' };
    const fetchFn = jest.fn<() => Promise<ApiPayload>>().mockResolvedValue(apiPayload);
    const onDataFn = jest.fn<(data: CachePayload | ApiPayload) => void>();

    mockUseGetCache.mockReturnValue({
      cached: null,
      hydrated: true,
    });

    renderHook(() =>
      useCacheAndFetch(
        createUser(),
        keyAuth,
        true,
        fetchFn,
        onDataFn,
        apiPayload,
        'Auth Context',
      ),
    );

    await waitFor(() => {
      expect(fetchFn).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockUseUpdateCache).toHaveBeenLastCalledWith(
        'Auth Context',
        keyAuth('user-1'),
        apiPayload,
        TTL_48H,
        true,
      );
    });
  });
});
