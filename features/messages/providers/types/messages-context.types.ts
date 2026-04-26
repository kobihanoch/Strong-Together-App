import { UserMessages } from '../../types/messages.types';

export type MessagesProviderCachePayload = { messages: UserMessages }; // Default is an empty array

export interface MessagesProviderValue {
  unreadMessages: UserMessages | undefined;
  allReceivedMessages: UserMessages | undefined;
  setAllReceivedMessages: React.Dispatch<React.SetStateAction<UserMessages | undefined>>;
  loadingMessages: boolean;
}
