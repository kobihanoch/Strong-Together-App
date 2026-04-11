import { AllUserMessages } from '@strong-together/shared';

export const filterMessagesByUnread = (messagesArr: AllUserMessages[]): AllUserMessages[] => {
  return messagesArr.filter((msg) => msg.is_read === false);
};
