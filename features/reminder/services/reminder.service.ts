import {
  GetReminderSettingsResponse,
  UpsertReminderSettingsBody,
  UpsertReminderSettingsResponse,
} from '@strong-together/shared';
import api from '../../../infrastructure/api/api-config/api';

export const getUserReminder = async (): Promise<GetReminderSettingsResponse> => {
  const { data } = await api.get<GetReminderSettingsResponse>('/api/reminders');
  return data;
};

export const updateUserReminder = async (reminder: UpsertReminderSettingsBody): Promise<UpsertReminderSettingsResponse> => {
  const { data } = await api.put<UpsertReminderSettingsResponse>('/api/reminders', reminder);
  return data;
};
