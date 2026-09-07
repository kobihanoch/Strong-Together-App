import { UpsertReminderSettingsBody } from '@strong-together/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../auth/providers/AuthProvider';
import { getUserReminder, updateUserReminder } from '../services/reminder.service';

export const useReminder = (hasNotificationsPermission: boolean) => {
  const { userIdCache: userId, isValidatedWithServer } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = ['reminder', userId];

  const query = useQuery({
    queryKey,
    queryFn: getUserReminder,
    enabled: Boolean(isValidatedWithServer && userId),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const updateSourceReminder = useMutation({
    mutationFn: async (reminder: UpsertReminderSettingsBody) => {
      if (!userId) throw new Error('User is not authenticated');
      if (reminder.reminderEnabled) {
        const permission = await Notifications.getPermissionsAsync();
        if (permission.status !== Notifications.PermissionStatus.GRANTED) {
          throw new Error('Notifications are not enabled');
        }
      }

      await updateUserReminder(reminder);
    },
    onSuccess: async () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    data: {
      reminder: query.data?.reminderSettings ?? null,
      canEnableReminder: hasNotificationsPermission,
    },
    loadingStates: {
      isPending: query.isPending,
      isFetching: query.isFetching,
      isUpdating: updateSourceReminder.isPending,
    },
    actions: {
      refetch: query.refetch,
      updateReminder: updateSourceReminder.mutateAsync,
    },
  };
};
