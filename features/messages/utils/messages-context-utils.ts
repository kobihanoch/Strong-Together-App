import { UserMessages } from '../types/messages.types';

export const filterMessagesByUnread = (messagesArr: UserMessages | undefined | null): UserMessages | undefined => {
  if (messagesArr === undefined) return undefined;
  if (!messagesArr) return [];
  return messagesArr.filter((msg) => msg.isRead === false);
};
