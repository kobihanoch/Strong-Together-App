import { GetAllUserMessagesResponse } from '@strong-together/shared';
import { AllUserMessages } from '@strong-together/shared';

export type NotificationsContextAllReceivedMessages = GetAllUserMessagesResponse['messages'];

export type NotificationsContextCachePayload = { messages: NotificationsContextAllReceivedMessages }; // Default is an empty array

export interface NotificationsContextValue {
  unreadMessages: AllUserMessages[];
  allReceivedMessages: NotificationsContextAllReceivedMessages;
  setAllReceivedMessages: React.Dispatch<React.SetStateAction<NotificationsContextAllReceivedMessages>>;
  loadingMessages: boolean;
}
