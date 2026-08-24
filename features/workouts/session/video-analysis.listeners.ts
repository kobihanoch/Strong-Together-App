import type { AnalyzeVideoResultPayloadDto } from '@strong-together/shared';
import type { SquatRepetition } from './types/video-analysis.types';
import { getSocket } from '../../../infrastructure/socket';

export const registerToVideoAnalysisResultsListener = (
  onResults: (results: AnalyzeVideoResultPayloadDto<SquatRepetition>) => void,
) => {
  const socket = getSocket();

  console.log('[video-analysis] register listener', {
    hasSocket: !!socket,
    connected: socket?.connected,
    socketId: socket?.id,
  });

  if (!socket) return;

  const handler = (results: AnalyzeVideoResultPayloadDto<SquatRepetition>) => {
    onResults(results);
  };

  socket.on(`video_analysis_results`, handler);

  return () => {
    socket.off(`video_analysis_results`, handler);
  };
};
