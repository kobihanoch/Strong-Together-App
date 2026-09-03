import api from '../../../infrastructure/api/api-config/api';
import { DeleteMessageParams, ListMessagesQuery, MarkMessageAsReadParams } from '@strong-together/shared';
import { ListMessagesResponse } from '@strong-together/shared';

export const updateMsgReadStatus = async (msgId: MarkMessageAsReadParams['id']): Promise<void> => {
  const pathParams = { id: msgId } satisfies MarkMessageAsReadParams;
  await api.patch(`/api/messages/${pathParams.id}/read`);
};

// Get messages

export const getUserMessages = async (): Promise<ListMessagesResponse> => {
  const { data } = await api.get<ListMessagesResponse>('/api/messages', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies ListMessagesQuery,
  });
  return data;
};

// Delete a message

export const deleteMessage = async (msgId: DeleteMessageParams['id']): Promise<void> => {
  const pathParams = { id: msgId } satisfies DeleteMessageParams;
  await api.delete(`/api/messages/${pathParams.id}`);
};
