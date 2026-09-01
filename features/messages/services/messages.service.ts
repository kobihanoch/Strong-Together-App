import api from '../../../infrastructure/api/api-config/api';
import { DeleteMessageParams, ListMessagesQuery, MarkMessageAsReadParams } from '@strong-together/shared';
import { DeleteMessageResponse, ListMessagesResponse, MarkMessageAsReadResponse } from '@strong-together/shared';

export const updateMsgReadStatus = async (msgId: MarkMessageAsReadParams['id']): Promise<MarkMessageAsReadResponse['id']> => {
  const pathParams = { id: msgId } satisfies MarkMessageAsReadParams;
  const response = await api.patch<MarkMessageAsReadResponse>(`/api/messages/${pathParams.id}/read`);
  return response.data.id;
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
  await api.delete<DeleteMessageResponse>(`/api/messages/${pathParams.id}`);
};
