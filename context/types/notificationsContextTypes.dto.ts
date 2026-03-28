import { GetAllUserMessagesResponse } from '../../types/api/messages/responses';
import { AllUserMessages } from '../../types/dto/messages.dto';

export type NotificationsContextAllReceivedMessages = GetAllUserMessagesResponse['messages'];

export type NotificationsContextCachePayload = { messages: NotificationsContextAllReceivedMessages }; // Default is an empty array

export interface NotificationsContextValue {
  unreadMessages: AllUserMessages[];
  allReceivedMessages: NotificationsContextAllReceivedMessages;
  setAllReceivedMessages: React.Dispatch<React.SetStateAction<NotificationsContextAllReceivedMessages>>;
  loadingMessages: boolean;
}
