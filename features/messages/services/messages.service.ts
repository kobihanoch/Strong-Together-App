import api from '../../../api/api';
import { DeleteMessageParams, GetAllUserMessagesQuery, MarkMessageAsReadParams } from '@strong-together/shared';
import { DeleteMessageResponse, GetAllUserMessagesResponse, MarkMessageAsReadResponse } from '@strong-together/shared';

export const updateMsgReadStatus = async (
  msgId: MarkMessageAsReadParams['id'],
): Promise<MarkMessageAsReadResponse['id']> => {
  const pathParams = { id: msgId } satisfies MarkMessageAsReadParams;
  const response = await api.put<MarkMessageAsReadResponse>(`/api/messages/markasread/${pathParams.id}`);
  return response.data.id;
};

// Get messages
export const getUserMessages = async (): Promise<GetAllUserMessagesResponse> => {
  const { data } = await api.get<GetAllUserMessagesResponse>('/api/messages/getmessages', {
    params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone } satisfies GetAllUserMessagesQuery,
  });
  return data;
};

// Delete a message
export const deleteMessage = async (msgId: DeleteMessageParams['id']): Promise<void> => {
  const pathParams = { id: msgId } satisfies DeleteMessageParams;
  await api.delete<DeleteMessageResponse>(`/api/messages/delete/${pathParams.id}`);
};
