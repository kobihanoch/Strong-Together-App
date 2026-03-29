import { Dispatch, SetStateAction } from 'react';
import { getSocket } from './socketConfig';
import { NotificationsContextAllReceivedMessages } from '../context/types/notificationsContextTypes.dto';
import { MessageAfterSendResponse } from '../types/dto/messages.dto';
import { AnalyzeVideoResultPayload, SquatRepetition } from '../types/dto/videoAnalysis.dto';

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
  jobId: string,
  setAnalysisResults: React.Dispatch<React.SetStateAction<AnalyzeVideoResultPayload<SquatRepetition> | null>>,
) => {
  const socket = getSocket();
  if (!socket) return;

  // Registration
  const handler = (results: AnalyzeVideoResultPayload<SquatRepetition>) => setAnalysisResults(results);
  socket.on(`video_analysis_results:${jobId}`, handler);

  // Cleanup
  return () => {
    socket.off(`video_analysis_results:${jobId}`, handler);
  };
};
