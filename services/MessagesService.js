import api from "../api/api";

export const updateMsgReadStatus = async (msgId) => {
  try {
    const response = await api.put(`/api/messages/markasread/${msgId}`);
    return response.data.id;
  } catch (error) {
    throw error;
  }
};

// Get messages
export const getUserMessages = async () => {
  try {
    const response = await api.get("/api/messages/getmessages", {
      params: { tz: Intl.DateTimeFormat().resolvedOptions().timeZone },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (msgId) => {
  try {
    const { data } = await api.delete(`/api/messages/delete/${msgId}`);
    console.log(`Message ${data.id} deleted.`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
