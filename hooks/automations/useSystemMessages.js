import { useState, useEffect } from "react";
import { sendSystemMessageToUser } from "../../services/SystemMessagesService";

const useSystemMessages = (user) => {
  const [isSending, setIsSending] = useState(false);

  const sendSystemMessage = async (header, msg) => {
    console.log("Started sending");
    setIsSending(true);
    try {
      await sendSystemMessageToUser(user, header, msg);
      console.log("Sent!");
    } catch (err) {
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return { isSending, sendSystemMessage };
};

export default useSystemMessages;
