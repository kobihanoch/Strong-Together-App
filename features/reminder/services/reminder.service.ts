import { UpsertReminderSettingsBody } from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

export const updateUserReminder = async (reminder: UpsertReminderSettingsBody): Promise<void> => {
  await api.put('/api/reminders', reminder);
};
