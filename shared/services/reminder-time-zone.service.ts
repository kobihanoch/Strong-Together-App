import { UpdateReminderTimeZoneBody, UpdateReminderTimeZoneResponse } from '@strong-together/shared';
import api from '../../infrastructure/api/api-config/api';

/**
 * Updates the reminder timezone on the server.
 *
 * The endpoint contract is intentionally pending. Keep server synchronization
 * disabled in useTimeZoneSync until this function contains the real API call.
 */
export const updateReminderTimeZone = async (timeZone: UpdateReminderTimeZoneBody['timeZone']): Promise<UpdateReminderTimeZoneResponse> => {
  await api.patch('/api/reminders/time-zone', { timeZone } satisfies UpdateReminderTimeZoneBody);
};
