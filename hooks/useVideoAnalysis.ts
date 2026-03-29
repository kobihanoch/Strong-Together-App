/* eslint-disable prefer-const */
import { useCallback, useEffect, useRef, useState } from 'react';
import { showErrorAlert } from '../errors/errorAlerts';
import { getPresignedUrlFromS3, publishAnalyzeJobToServer, uploadVideoToS3 } from '../services/AnalyzeVideoService';
import { GetPresignedUrlFromS3Body } from '../types/api/videoAnalysis/requests';
import { AnalyzeVideoResultPayload, SquatRepetition } from '../types/dto/videoAnalysis.dto';
import { ExerciseEntity } from '../types/entities/exercise.entity';
import { registerToVideoAnalysisResultsListener } from '../webSockets/socketListeners';

type useVideoAnalysisProps = {
  fileName: GetPresignedUrlFromS3Body['fileName'];
  fileType: GetPresignedUrlFromS3Body['fileType'];
  exercise: ExerciseEntity['name'];
  fileURI: string;
};

type VideoAnalysisPhase = 'idle' | 'uploading' | 'publishing' | 'waiting_results';

const useVideoAnalysis = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [phase, setPhase] = useState<VideoAnalysisPhase>('idle');
  const [analysisResults, setAnalysisResults] = useState<AnalyzeVideoResultPayload<SquatRepetition> | null>(null);
  const inFlightRef = useRef(false);
  const cleanupListenerRef = useRef<(() => void) | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearInFlightState = useCallback(() => {
    inFlightRef.current = false;
    abortControllerRef.current = null;
    setLoading(false);
    setPhase('idle');
    setUploadProgress(0);
  }, []);

  const cleanupListener = useCallback(() => {
    cleanupListenerRef.current?.();
    cleanupListenerRef.current = null;
  }, []);

  const cancelAnalysis = useCallback(() => {
    abortControllerRef.current?.abort();
    cleanupListener();
    clearInFlightState();
  }, [clearInFlightState, cleanupListener]);

  const resetAnalysis = useCallback(() => {
    cancelAnalysis();
    setAnalysisResults(null);
  }, [cancelAnalysis]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      cleanupListenerRef.current?.();
      cleanupListenerRef.current = null;
      inFlightRef.current = false;
      abortControllerRef.current = null;
    };
  }, []);

  const analyzeVideo = async ({
    fileName,
    fileType,
    exercise,
    fileURI,
  }: useVideoAnalysisProps): Promise<(() => void) | void> => {
    if (inFlightRef.current) {
      return;
    }

    let waitingForServerResults = false;
    let currentStage: Exclude<VideoAnalysisPhase, 'idle' | 'waiting_results'> = 'uploading';

    try {
      inFlightRef.current = true;
      setLoading(true);
      setUploadProgress(0);
      setAnalysisResults(null);
      cleanupListener();
      abortControllerRef.current = new AbortController();

      // Get presigned S3 URL
      setPhase('uploading');
      const { uploadUrl, fileKey } = await getPresignedUrlFromS3({ fileName, fileType });

      // Upload to S3
      await uploadVideoToS3(uploadUrl, fileURI, fileType, {
        abortSignal: abortControllerRef.current.signal,
        onProgress: setUploadProgress,
      });

      if (abortControllerRef.current.signal.aborted) {
        console.log('[VideoAnalysis] Upload canceled');
        return;
      }

      // Publish job to server
      currentStage = 'publishing';
      setPhase('publishing');
      const { jobId } = await publishAnalyzeJobToServer({ fileKey, exercise });

      const handleResults = (results: AnalyzeVideoResultPayload<SquatRepetition>) => {
        setAnalysisResults(results);
        setUploadProgress(100);
        cleanupListenerRef.current?.();
        cleanupListenerRef.current = null;
        clearInFlightState();
      };

      // Wait for results (register a listener)
      cleanupListenerRef.current = registerToVideoAnalysisResultsListener(jobId, handleResults) ?? null;
      console.log('[VideoAnalysis] WebSocket listener is registered');

      setPhase('waiting_results');
      waitingForServerResults = true;

      return () => {
        cleanupListenerRef.current?.();
        cleanupListenerRef.current = null;
      };
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      if (currentStage === 'uploading') {
        console.log('[VideoAnalysis] Upload failed', error);
        showErrorAlert('Error uploading file', 'Unable to upload the processed video file.');
        return;
      }

      console.log('[VideoAnalysis] Analyze flow failed', error);
      showErrorAlert('Analyze failed', 'Unable to start the AI analysis right now.');
      return;
    } finally {
      if (!waitingForServerResults) {
        clearInFlightState();
      }
    }
  };

  return { loading, analyzeVideo, analysisResults, uploadProgress, phase, cancelAnalysis, resetAnalysis };
};

export default useVideoAnalysis;
