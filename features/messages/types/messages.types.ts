import type { GetAllUserMessagesResponse, MessageAfterSendQueryDto } from '@strong-together/shared';

export type UserMessages = GetAllUserMessagesResponse['messages'];
export type UserMessage = UserMessages[number];
export type IncomingMessage = MessageAfterSendQueryDto;

export interface MessagesProviderValue {
  unreadMessages: UserMessages;
  allReceivedMessages: UserMessages;
  setAllReceivedMessages: (messages: UserMessages) => Promise<void>;
  loadingMessages: boolean;
}
