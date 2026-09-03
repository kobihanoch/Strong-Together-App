import { CreateAerobicEntryBody } from '@strong-together/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getStartOfWeek } from '../../../../shared/utils/shared-utils';
import { useAuth } from '../../../auth/providers/AuthProvider';
import { deleteUserCardio, getUserCardio, logUserCardio, updateUserCardio } from '../services/cardio.service';
import { CardioEntryInput, CardioMaps, EditableCardioRecord } from '../types/cardio.types';
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
      await logUserCardio(cardioEntry);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });
  const updateSourceCardio = useMutation({
    mutationFn: ({ id, record }: { id: EditableCardioRecord['id']; record: CardioEntryInput }) => updateUserCardio(id, record),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });
  const deleteSourceCardio = useMutation({
    mutationFn: (id: EditableCardioRecord['id']) => deleteUserCardio(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

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
      isEditing: updateSourceCardio.isPending,
      isDeleting: deleteSourceCardio.isPending,
    },

    // Actions
    actions: {
      logCardio: addSourceCardio.mutateAsync,
      updateCardio: updateSourceCardio.mutateAsync,
      deleteCardio: deleteSourceCardio.mutateAsync,
      refetch: query.refetch,
    },
  };
};
