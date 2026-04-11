import { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { getSocket } from '../../../infrastructure/socket';

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
