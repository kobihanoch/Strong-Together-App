import { UpsertReminderSettingsBody } from '@strong-together/shared';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../auth/providers/AuthProvider';
import { updateUserReminder } from '../services/reminder.service';

export const useReminder = (hasNotificationsPermission: boolean) => {
  const { userIdCache: userId } = useAuth();

  const updateSourceReminder = useMutation({
    mutationFn: async (reminder: UpsertReminderSettingsBody) => {
      if (!userId) throw new Error('User is not authenticated');
      if (reminder.reminderEnabled && !hasNotificationsPermission) {
        throw new Error('Notifications are not enabled');
      }

      await updateUserReminder(reminder);
    },
  });

  return {
    data: { canEnableReminder: hasNotificationsPermission },
    loadingStates: { isUpdating: updateSourceReminder.isPending },
    actions: { updateReminder: updateSourceReminder.mutateAsync },
  };
};
