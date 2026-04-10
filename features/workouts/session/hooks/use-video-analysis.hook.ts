import * as Sentry from '@sentry/react-native';
import { startNewTrace } from '@sentry/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { uuidv4 } from 'react-native-compressor';
import { showErrorAlert } from '../../../../errors/errorAlerts';
import { getPresignedUrlFromS3, uploadVideoToS3 } from '../services/analyze-video.service';
import { GetPresignedUrlFromS3Body } from '@strong-together/shared';
import { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { ExerciseEntity } from '@strong-together/shared';
import { registerToVideoAnalysisResultsListener } from '../../../../webSockets/socketListeners';

type UseVideoAnalysisProps = {
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
  const pipelineSpanRef = useRef<Sentry.Span | null>(null);
  const phaseRef = useRef<VideoAnalysisPhase>('idle');

  const setCurrentPhase = useCallback((nextPhase: VideoAnalysisPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const finishPipelineSpan = useCallback(() => {
    pipelineSpanRef.current?.end();
    pipelineSpanRef.current = null;
  }, []);

  const clearInFlightState = useCallback(() => {
    inFlightRef.current = false;
    abortControllerRef.current = null;
    setLoading(false);
    phaseRef.current = 'idle';
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
    finishPipelineSpan();
    clearInFlightState();
  }, [clearInFlightState, cleanupListener, finishPipelineSpan]);

  const resetAnalysis = useCallback(() => {
    cancelAnalysis();
    setAnalysisResults(null);
  }, [cancelAnalysis]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      cleanupListenerRef.current?.();
      cleanupListenerRef.current = null;
      finishPipelineSpan();
      inFlightRef.current = false;
      abortControllerRef.current = null;
    };
  }, [finishPipelineSpan]);

  const analyzeVideo = async ({ exercise, fileType, fileURI }: UseVideoAnalysisProps): Promise<(() => void) | void> => {
    if (inFlightRef.current) {
      return;
    }

    let waitingForServerResults = false;

    try {
      inFlightRef.current = true;
      setLoading(true);
      setUploadProgress(0);
      setAnalysisResults(null);
      cleanupListener();
      abortControllerRef.current = new AbortController();

      return await startNewTrace(() =>
        Sentry.startSpanManual(
          {
            name: 'video-analysis.pipeline',
            op: 'ai.video.analysis',
          },
          async (pipelineSpan) => {
            pipelineSpanRef.current = pipelineSpan;

            // Create a jobID
            const jobId = uuidv4();
            pipelineSpan.setAttribute('video_analysis.job_id', jobId);

            // Mirror the phase in a ref so catch blocks always see the latest step.
            setCurrentPhase('uploading');

            const { uploadUrl } = await getPresignedUrlFromS3({
              exercise,
              fileType,
              jobId,
            });

            await Sentry.startSpan(
              {
                name: 'video-analysis.upload-to-s3',
                op: 'file.upload',
              },
              async () => {
                await uploadVideoToS3(uploadUrl, fileURI, fileType, {
                  abortSignal: abortControllerRef.current!.signal,
                  onProgress: setUploadProgress,
                });
              },
            );

            if (abortControllerRef.current?.signal.aborted) {
              console.log('[video-analysis] Upload canceled');
              finishPipelineSpan();
              return;
            }

            // After the upload completes, the flow continues asynchronously via websocket.
            setCurrentPhase('waiting_results');
            waitingForServerResults = true;

            const handleResults = (results: AnalyzeVideoResultPayload<SquatRepetition>) => {
              // Re-activate the pipeline span so websocket work stays under the same trace.
              Sentry.withActiveSpan(pipelineSpanRef.current, () => {
                Sentry.startSpan(
                  {
                    name: 'video-analysis.results-received',
                    op: 'websocket.receive',
                  },
                  (resultsSpan) => {
                    resultsSpan.setAttribute('video_analysis.status', results.status);
                    if (results.requestId) {
                      resultsSpan.setAttribute('video_analysis.request_id', results.requestId);
                    }
                    if (results.jobId) {
                      resultsSpan.setAttribute('video_analysis.job_id', results.jobId);
                    }

                    // Surface backend analysis failures returned over the socket.
                    if (results.error) {
                      showErrorAlert('Error analyzing video', results.error);
                    }

                    setAnalysisResults(results);
                    setUploadProgress(100);
                    cleanupListener();
                    finishPipelineSpan();
                    clearInFlightState();
                  },
                );
              });
            };

            cleanupListenerRef.current = registerToVideoAnalysisResultsListener(handleResults) ?? null;
            console.log('[video-analysis] WebSocket listener is registered');

            return () => {
              cleanupListener();
            };
          },
        ),
      );
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        finishPipelineSpan();
        return;
      }

      Sentry.captureException(error);

      // React state updates are async, so use the ref for the latest phase.
      if (phaseRef.current === 'uploading') {
        console.log('[video-analysis] Upload failed', error);
        showErrorAlert('Error uploading file', 'Unable to upload the processed video file.');
      } else {
        console.log('[video-analysis] Analyze flow failed', error);
        showErrorAlert('Analyze failed', 'Unable to start the AI analysis right now.');
      }

      finishPipelineSpan();
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


