/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import moment from 'moment';
import {
  guestProfile,
  userWithWorkoutAndHistoryProfile,
  userWithoutWorkoutProfile,
} from '../../../../../../tests/fixtures/userProfiles';
import type { UserAerobicsResponse } from '@strong-together/shared';

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

type UseCacheAndFetchReturn = { loading: boolean; cacheKnown: boolean };
type UseCacheAndFetchMockFn = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: (data: any) => void,
  cachedPayload: unknown,
  logLabel: string,
) => UseCacheAndFetchReturn;

const mockAuthState = jest.fn<
  () => {
    user: typeof userWithoutWorkoutProfile.user;
    isValidatedWithServer: boolean;
  }
>();
const mockUseCacheAndFetch = jest.fn<UseCacheAndFetchMockFn>();
const mockUseUpdateGlobalLoading = jest.fn<(key: string, value: boolean) => void>();
const mockGetUserCardio = jest.fn<() => Promise<UserAerobicsResponse>>();

const useCacheAndFetchMock = (
  user: unknown,
  keyBuilderFn: unknown,
  isValidatedByServerFlag: boolean,
  fetchFn: unknown,
  onDataFn: (data: any) => void,
  cachedPayload: unknown,
  logLabel: string,
) => mockUseCacheAndFetch(user, keyBuilderFn, isValidatedByServerFlag, fetchFn, onDataFn, cachedPayload, logLabel);

const useUpdateGlobalLoadingMock = (key: string, value: boolean) => mockUseUpdateGlobalLoading(key, value);
const getUserCardioMock = () => mockGetUserCardio();

jest.mock('../../../../../guest-user/auth/shared/providers/AuthProvider', () => ({
  useAuth: () => mockAuthState(),
}));

jest.mock('../../../../../../hooks/useCacheAndFetch', () => ({
  __esModule: true,
  default: useCacheAndFetchMock,
}));

jest.mock('../../../../../../hooks/useUpdateGlobalLoading', () => ({
  __esModule: true,
  default: useUpdateGlobalLoadingMock,
}));

jest.mock('../../../cardio/services/cardio.service', () => ({
  getUserCardio: getUserCardioMock,
}));

import { CardioProvider, useCardioContext } from '../CardioProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => <CardioProvider>{children}</CardioProvider>;

const createHydratingUseCacheAndFetchMock = (payload: UserAerobicsResponse | any) => {
  let hydrated = false;
  return (
    user: unknown,
    keyBuilderFn: unknown,
    isValidated: boolean,
    fetchFn: unknown,
    onDataFn: (data: any) => void,
    cachedPayload: unknown,
    label: string,
  ) => {
    if (!hydrated) {
      hydrated = true;
      onDataFn(payload);
    }
    return {
      loading: false,
      cacheKnown: true,
    };
  };
};

const createTodayCardioPayload = (): UserAerobicsResponse => {
  const today = moment().format('YYYY-MM-DD');
  const firstRecord = userWithWorkoutAndHistoryProfile.cardioDailyMap?.['2026-03-27']?.[0];

  return {
    daily: firstRecord
      ? {
          [today]: [{ ...firstRecord }],
        }
      : {},
    weekly: userWithWorkoutAndHistoryProfile.cardioWeeklyMap
      ? {
          ...userWithWorkoutAndHistoryProfile.cardioWeeklyMap,
        }
      : {},
  };
};

describe('CardioContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthState.mockReturnValue({
      user: guestProfile.user,
      isValidatedWithServer: false,
    });
    mockUseCacheAndFetch.mockReturnValue({
      loading: false,
      cacheKnown: true,
    });
    mockGetUserCardio.mockResolvedValue({
      daily: {},
      weekly: {},
    });
  });

  it('keeps all cardio state empty for the guest profile', () => {
    const { result } = renderHook(() => useCardioContext(), { wrapper });

    expect(result.current.dailyCardioMap).toBe(guestProfile.cardioDailyMap);
    expect(result.current.weeklyCardioMap).toBe(guestProfile.cardioWeeklyMap);
    expect(result.current.cardioForToday).toBeNull();
    expect(result.current.hasDoneCardioToday).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(mockUseCacheAndFetch).toHaveBeenLastCalledWith(
      guestProfile.user,
      expect.any(Function),
      false,
      expect.any(Function),
      expect.any(Function),
      {
        daily: null,
        weekly: null,
      },
      'Cardio Context',
    );
  });

  it('hydrates empty cardio maps for a signed-in user with no cardio history', async () => {
    mockAuthState.mockReturnValue({
      user: userWithoutWorkoutProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        daily: userWithoutWorkoutProfile.cardioDailyMap,
        weekly: userWithoutWorkoutProfile.cardioWeeklyMap,
      }),
    );

    const { result } = renderHook(() => useCardioContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.dailyCardioMap).toEqual(userWithoutWorkoutProfile.cardioDailyMap);
    });

    expect(result.current.weeklyCardioMap).toEqual(userWithoutWorkoutProfile.cardioWeeklyMap);
    expect(result.current.cardioForToday).toBeNull();
    expect(result.current.hasDoneCardioToday).toBe(false);
  });

  it('hydrates cardio data and derives today cardio state for a user with cardio', async () => {
    mockAuthState.mockReturnValue({
      user: userWithWorkoutAndHistoryProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(createHydratingUseCacheAndFetchMock(createTodayCardioPayload()));

    const { result } = renderHook(() => useCardioContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.cardioForToday).toEqual({
        type: 'Run',
        duration_mins: 25,
        duration_sec: 30,
      });
    });

    expect(result.current.dailyCardioMap).toEqual(
      expect.objectContaining({
        [moment().format('YYYY-MM-DD')]: [
          {
            type: 'Run',
            duration_mins: 25,
            duration_sec: 30,
          },
        ],
      }),
    );
    expect(result.current.weeklyCardioMap).toEqual(userWithWorkoutAndHistoryProfile.cardioWeeklyMap);
    expect(result.current.hasDoneCardioToday).toBe(true);
  });

  it('updates derived cardio state when todays record is set through the exposed setter', async () => {
    mockAuthState.mockReturnValue({
      user: userWithoutWorkoutProfile.user,
      isValidatedWithServer: true,
    });
    mockUseCacheAndFetch.mockImplementation(
      createHydratingUseCacheAndFetchMock({
        daily: userWithoutWorkoutProfile.cardioDailyMap,
        weekly: userWithoutWorkoutProfile.cardioWeeklyMap,
      }),
    );

    const { result } = renderHook(() => useCardioContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.dailyCardioMap).toEqual({});
    });

    await act(async () => {
      result.current.setDailyCardioMap({
        [moment().format('YYYY-MM-DD')]: [
          {
            type: 'Bike',
            duration_mins: 18,
            duration_sec: 45,
          },
        ],
      });
    });

    expect(result.current.cardioForToday).toEqual({
      type: 'Bike',
      duration_mins: 18,
      duration_sec: 45,
    });
    expect(result.current.hasDoneCardioToday).toBe(true);
  });
});

