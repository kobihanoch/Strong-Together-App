import type { GetAllUserMessagesResponse, MessageRow, UserRow } from '@strong-together/shared';

export type UserMessages = GetAllUserMessagesResponse['messages'];
export type UserMessage = UserMessages[number];
export type IncomingMessage = Pick<MessageRow, 'id' | 'senderId' | 'receiverId' | 'subject' | 'msg' | 'isRead'> & {
  sentAt: string;
  senderUsername: UserRow['username'];
  senderFullName: UserRow['name'];
  senderProfilePicPath: UserRow['profilePicPath'];
  senderGender: UserRow['gender'];
};
