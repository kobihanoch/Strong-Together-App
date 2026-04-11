import { Dispatch, SetStateAction } from 'react';
import { MessagesContextAllReceivedMessages } from '../features/messages/types/messages-context.types';
import { MessageAfterSendResponse } from '@strong-together/shared';
import { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { getSocket } from './socketConfig';

export const registerToMessagesListener = (
  setMsgs: Dispatch<SetStateAction<MessagesContextAllReceivedMessages>>,
) => {
  const socket = getSocket();
  if (!socket) return;

  // Function
  const handler = (msg: MessageAfterSendResponse) => {
    // Set all recieved messages at context.
    // Checks for duplications before
    setMsgs((prev: MessagesContextAllReceivedMessages) => {
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

  console.log('[video-analysis] register listener', {
    hasSocket: !!socket,
    connected: socket?.connected,
    socketId: socket?.id,
  });

  if (!socket) return;

  const handler = (results: AnalyzeVideoResultPayload<SquatRepetition>) => {
    onResults(results);
  };

  socket.on(`video_analysis_results`, handler);

  return () => {
    socket.off(`video_analysis_results`, handler);
  };
};
