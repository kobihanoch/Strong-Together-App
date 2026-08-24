import { UserMessages } from '../types/messages.types';

export const filterMessagesByUnread = (messagesArr: UserMessages | undefined): UserMessages | undefined => {
  if (messagesArr === undefined) return undefined;
  return messagesArr.filter((msg) => msg.is_read === false);
};
