import { Dispatch, SetStateAction } from 'react';
import { NotificationsContextAllReceivedMessages } from '../context/types/notificationsContextTypes.dto';
import { MessageAfterSendResponse } from '../types/dto/messages.dto';
import { AnalyzeVideoResultPayload, SquatRepetition } from '../types/dto/videoAnalysis.dto';
import { getSocket } from './socketConfig';

export const registerToMessagesListener = (
  setMsgs: Dispatch<SetStateAction<NotificationsContextAllReceivedMessages>>,
) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg: MessageAfterSendResponse) => {
    // Set all recieved messages at context.
    // Checks for duplications before
    setMsgs((prev: NotificationsContextAllReceivedMessages) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [msg, ...prev];
    });
  };

  // Registration
  socket.on('new_message', handler);

  // Cleanup
  return () => {
    socket.off('new_message', handler);
  };
};

export const registerToVideoAnalysisResultsListener = (
  onResults: (results: AnalyzeVideoResultPayload<SquatRepetition>) => void,
) => {
  const socket = getSocket();

  console.log('[VideoAnalysis] register listener', {
    hasSocket: !!socket,
    connected: socket?.connected,
    socketId: socket?.id,
  });

  if (!socket) return;

  const handler = (results: AnalyzeVideoResultPayload<SquatRepetition>) => {
    onResults(results);
  };

  socket.on('video_analysis_results', handler);

  return () => {
    socket.off('video_analysis_results', handler);
  };
};
