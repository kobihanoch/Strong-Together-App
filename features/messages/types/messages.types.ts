import type { ListMessagesResponse, MessageAfterSendQueryDto } from '@strong-together/shared';

export type UserMessages = ListMessagesResponse['messages'];
export type UserMessage = UserMessages[number];
export type IncomingMessage = MessageAfterSendQueryDto;
