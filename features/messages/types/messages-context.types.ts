import { GetAllUserMessagesResponse } from '@strong-together/shared';
import { AllUserMessages } from '@strong-together/shared';

export type MessagesContextAllReceivedMessages = GetAllUserMessagesResponse['messages'];

export type MessagesContextCachePayload = { messages: MessagesContextAllReceivedMessages }; // Default is an empty array

export interface MessagesContextValue {
  unreadMessages: AllUserMessages[];
  allReceivedMessages: MessagesContextAllReceivedMessages;
  setAllReceivedMessages: React.Dispatch<React.SetStateAction<MessagesContextAllReceivedMessages>>;
  loadingMessages: boolean;
}
