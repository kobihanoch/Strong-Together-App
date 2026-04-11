import { AllUserMessages } from '@strong-together/shared';
import { MessagesAllReceivedMessages } from '../../types/messages.types';

export type MessagesProviderCachePayload = { messages: MessagesAllReceivedMessages }; // Default is an empty array

export interface MessagesProviderValue {
  unreadMessages: AllUserMessages[];
  allReceivedMessages: MessagesAllReceivedMessages;
  setAllReceivedMessages: React.Dispatch<React.SetStateAction<MessagesAllReceivedMessages>>;
  loadingMessages: boolean;
}
