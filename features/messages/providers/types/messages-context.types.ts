import { AllUserMessages } from '@strong-together/shared';
import { UserMessages } from '../../types/messages.types';

export type MessagesProviderCachePayload = { messages: UserMessages }; // Default is an empty array

export interface MessagesProviderValue {
  unreadMessages: AllUserMessages[];
  allReceivedMessages: UserMessages;
  setAllReceivedMessages: React.Dispatch<React.SetStateAction<UserMessages>>;
  loadingMessages: boolean;
}
