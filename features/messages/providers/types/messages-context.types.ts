import { UserMessages } from '../../types/messages.types';

export interface MessagesProviderValue {
  unreadMessages: UserMessages;
  allReceivedMessages: UserMessages;
  setAllReceivedMessages: React.Dispatch<React.SetStateAction<UserMessages | undefined>>;
  loadingMessages: boolean;
}
