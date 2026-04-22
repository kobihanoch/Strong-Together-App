import { UserMessages } from '../types/messages.types';

export const filterMessagesByUnread = (messagesArr: UserMessages): UserMessages => {
  return messagesArr.filter((msg) => msg.is_read === false);
};
