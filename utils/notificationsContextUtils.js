export const filterMessagesByUnread = (messagesArr) => {
  if (messagesArr == []) return;
  return messagesArr.filter((msg) => msg.is_read === false);
};
