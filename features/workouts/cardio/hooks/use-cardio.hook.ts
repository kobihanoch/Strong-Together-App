import { CreateAerobicEntryBody } from '@strong-together/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getStartOfWeek } from '../../../../shared/utils/shared-utils';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { getUserCardio, logUserCardio } from '../services/cardio.service';
import { CardioMaps } from '../types/cardio.types';
import { checkIfDoneCardioInSelectedWeek, getCardioForToday } from '../utils/cardio.utils';

type CardioInput = CreateAerobicEntryBody['record'];

/**
 * Provides the authenticated user's persisted cardio server state.
 *
 * The hook fetches daily and weekly cardio maps, updates them after logging
 * cardio, and exposes derived helpers backed by the current query data.
 *
 * @returns Cardio data, loading states, and cache-aware actions.
 */
export const useCardio = () => {
  const { isValidatedWithServer, userIdCache: userId } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['cardio-maps', userId];

  // Fetching with SWR
  const query = useQuery({
    queryKey,

    queryFn: async (): Promise<CardioMaps> => await getUserCardio(),
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // DB updating
  const addSourceCardio = useMutation({
    mutationFn: async (cardioEntry: CardioInput) => {
      if (!userId) {
        throw new Error('User is not authenticated');
      }
      const data = await logUserCardio(cardioEntry);
      return data;
    },

    onSuccess: (updatedCardioMaps) => {
      queryClient.setQueryData<CardioMaps | null>(queryKey, updatedCardioMaps);
    },
  });

  // Update local

  const updateLocalCardioMaps = (updater: CardioMaps) => {
    if (userId) queryClient.setQueryData<CardioMaps>(queryKey, updater);
  };

  const cardioMaps = query.data;

  // Derived values
  const { daily: dailyCardioMap, weekly: weeklyCardioMap } = cardioMaps ?? {};
  const cardioForToday = getCardioForToday(dailyCardioMap);
  const hasDoneCardioInSelectedWeek = useCallback(
    (stringDate: string): boolean => {
      if (!weeklyCardioMap) return false;

      return checkIfDoneCardioInSelectedWeek(stringDate, weeklyCardioMap);
    },
    [weeklyCardioMap],
  );

  const cardioForSelectedWeek = (stringDate: string) => weeklyCardioMap?.[getStartOfWeek(stringDate)];

  return {
    // Data
    data: { dailyCardioMap, weeklyCardioMap, cardioForToday, hasDoneCardioInSelectedWeek, cardioForSelectedWeek },

    // Loading states
    loadingStates: {
      isPending: query.isPending,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isUpdating: addSourceCardio.isPending,
    },

    // Actions
    actions: {
      logCardio: addSourceCardio.mutateAsync,
      updateLocalCardioMaps,
      refetch: query.refetch,
    },
  };
};
