import { AllUserMessages } from '../types/dto/messages.dto';

export const filterMessagesByUnread = (messagesArr: AllUserMessages[]): AllUserMessages[] => {
  return messagesArr.filter((msg) => msg.is_read === false);
};
