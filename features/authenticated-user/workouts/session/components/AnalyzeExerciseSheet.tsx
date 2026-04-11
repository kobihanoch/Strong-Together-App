import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import VideoTrim, { showEditor } from 'react-native-video-trim';
import { Video as VideoCompressor, getVideoMetaData } from 'react-native-compressor';
import { colors } from '../../../../constants/colors';
import { getSupportedAnalysisExerciseName } from '../constants/video-analysis.constant';
import { showErrorAlert } from '../../../../errors/errorAlerts';
import useVideoAnalysis from '../hooks/use-video-analysis.hook';
import type { ExerciseAnalysisOverview } from '../screen/StartWorkout';
import { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { ExerciseInPlan } from '@strong-together/shared';
import {
  AnalyzeActionsSection,
  AnalyzeClipStatusCard,
  AnalyzeEmptyState,
  AnalyzeHeroSection,
  AnalyzeInfoSection,
  AnalyzePrimaryAction,
  AnalyzeProcessingCard,
  AnalyzeResultsSection,
  ExerciseAnalysisCopy,
} from './AnalyzeExerciseSheetSections';

type AnalyzeExerciseSheetProps = {
  selectedExercise: ExerciseInPlan | null;
  analysisOverview: ExerciseAnalysisOverview;
  onAnalysisOverviewChange: React.Dispatch<React.SetStateAction<ExerciseAnalysisOverview>>;
  cachedAnalysis: AnalyzeVideoResultPayload<SquatRepetition> | null;
  onCacheAnalysis: (
    exerciseId: ExerciseInPlan['id'],
    result: AnalyzeVideoResultPayload<SquatRepetition> | null,
    overview: ExerciseAnalysisOverview,
  ) => void;
};

type VideoSelectionState = {
  uri: string;
  fileName: string;
  fileType: string;
  sizeBytes: number | null;
  durationMs: number | null;
};

type TrimFinishEvent = {
  outputPath: string;
  startTime: number;
  endTime: number;
  duration: number;
};

type TrimErrorEvent = {
  message: string;
  errorCode: string;
};

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_TRIM_DURATION_MS = 30_000;
const COMPRESSED_MAX_SIZE = 540;
const COMPRESSED_MIN_SIZE_BYTES = 1 * 1024 * 1024;

const formatBytesToMb = (bytes: number | null | undefined): string => {
  if (!bytes || Number.isNaN(bytes)) return 'Unknown';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (durationMs: number | null | undefined): string => {
  if (!durationMs || Number.isNaN(durationMs)) return '--';
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const formatConfidence = (value: number | null | undefined): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--';
  return `${Math.round(value * 100)}%`;
};

const getExerciseAnalysisCopy = (exerciseName: string | null | undefined): ExerciseAnalysisCopy => {
  const normalized = getSupportedAnalysisExerciseName(exerciseName) ?? exerciseName?.trim().toLowerCase() ?? '';

  if (normalized.includes('squat')) {
    return {
      heroTitle: 'Squat Movement Analysis',
      heroSubtitle: 'Upload a short squat clip and get an instant movement read with clear coaching takeaways.',
      summaryPrimaryLabel: 'Good depth',
      summarySecondaryLabel: 'Torso fixes',
      primaryMetricLabel: 'Depth verdict',
      secondaryMetricLabel: 'Torso control',
      repLabel: 'Rep',
      confidenceTitle: 'Model confidence',
    };
  }

  return {
    heroTitle: 'AI Movement Analysis',
    heroSubtitle: 'Upload a short clip and we will process it automatically, then bring back the latest feedback here.',
    summaryPrimaryLabel: 'Strong reps',
    summarySecondaryLabel: 'Needs review',
    primaryMetricLabel: 'Movement quality',
    secondaryMetricLabel: 'Control',
    repLabel: 'Attempt',
    confidenceTitle: 'Model confidence',
  };
};

const AnalyzeExerciseSheet = ({
  selectedExercise,
  analysisOverview,
  onAnalysisOverviewChange,
  cachedAnalysis,
  onCacheAnalysis,
}: AnalyzeExerciseSheetProps) => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoSelectionState | null>(null);
  const [trimmedVideoUri, setTrimmedVideoUri] = useState<string | null>(null);
  const [compressedVideoUri, setCompressedVideoUri] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isPickingVideo, setIsPickingVideo] = useState(false);
  const [isAwaitingTrimResult, setIsAwaitingTrimResult] = useState(false);
  const [processingLabel, setProcessingLabel] = useState<string>('');
  const [selectedRepIndex, setSelectedRepIndex] = useState(0);
  const cleanupAnalysisRef = useRef<(() => void) | null>(null);
  const lastCachedCompletedRef = useRef<AnalyzeVideoResultPayload<SquatRepetition> | null>(null);

  const {
    loading: analysisLoading,
    analyzeVideo,
    analysisResults,
    uploadProgress,
    phase,
    cancelAnalysis,
    resetAnalysis,
  } = useVideoAnalysis();

  const resetProcessedVideoState = useCallback(() => {
    setTrimmedVideoUri(null);
    setCompressedVideoUri(null);
  }, []);
  const exerciseCopy = useMemo(() => getExerciseAnalysisCopy(selectedExercise?.exercise), [selectedExercise?.exercise]);

  const syncAnalysisOverview = useCallback(
    (nextOverview: ExerciseAnalysisOverview) => {
      onAnalysisOverviewChange((prev) => {
        if (
          prev.exerciseId === nextOverview.exerciseId &&
          prev.exerciseName === nextOverview.exerciseName &&
          prev.status === nextOverview.status &&
          prev.resultCount === nextOverview.resultCount
        ) {
          return prev;
        }

        return nextOverview;
      });
    },
    [onAnalysisOverviewChange],
  );

  const markAnalysisIdle = useCallback(() => {
    onAnalysisOverviewChange((prev) => {
      if (prev.exerciseId !== selectedExercise?.id) return prev;
      if (prev.status === 'idle' && prev.exerciseId === null) return prev;

      return { exerciseId: null, exerciseName: null, status: 'idle', resultCount: 0 };
    });
  }, [onAnalysisOverviewChange, selectedExercise?.id]);

  const hydrateVideoDetails = useCallback(async (uri: string, fallback?: Partial<VideoSelectionState>) => {
    try {
      const meta = await getVideoMetaData(uri);
      setSelectedVideo((prev) => ({
        uri,
        fileName: fallback?.fileName ?? prev?.fileName ?? uri.split('/').pop() ?? `analysis-${Date.now()}.mp4`,
        fileType: fallback?.fileType ?? prev?.fileType ?? 'video/mp4',
        sizeBytes: typeof meta?.size === 'number' ? meta.size : (fallback?.sizeBytes ?? prev?.sizeBytes ?? null),
        durationMs:
          typeof meta?.duration === 'number'
            ? meta.duration * 1000
            : (fallback?.durationMs ?? prev?.durationMs ?? null),
      }));
    } catch {
      setSelectedVideo((prev) => ({
        uri,
        fileName: fallback?.fileName ?? prev?.fileName ?? uri.split('/').pop() ?? `analysis-${Date.now()}.mp4`,
        fileType: fallback?.fileType ?? prev?.fileType ?? 'video/mp4',
        sizeBytes: fallback?.sizeBytes ?? prev?.sizeBytes ?? null,
        durationMs: fallback?.durationMs ?? prev?.durationMs ?? null,
      }));
    }
  }, []);

  const openTrimEditor = useCallback((videoUri: string) => {
    setIsAwaitingTrimResult(true);
    showEditor(videoUri, {
      maxDuration: MAX_TRIM_DURATION_MS,
      minDuration: 1_000,
      headerText: 'Trim up to 30 seconds',
      saveButtonText: 'Use clip',
      cancelButtonText: 'Cancel',
      trimmingText: 'Preparing clip...',
      trimmerColor: colors.primary,
      handleIconColor: colors.primaryDark,
      headerTextColor: colors.black,
    });
  }, []);

  const handleCompressAndAnalyze = useCallback(
    async (videoUri: string) => {
      const supportedExercise = getSupportedAnalysisExerciseName(selectedExercise?.exercise);

      if (!videoUri || !selectedExercise?.exercise || analysisLoading) {
        return;
      }

      if (!supportedExercise) {
        showErrorAlert('Analysis unavailable', 'AI analysis is not available for this exercise yet.');
        return;
      }

      try {
        setIsCompressing(true);
        setProcessingLabel('Compressing your clip before upload...');

        const compressedUri = await VideoCompressor.compress(
          videoUri,
          {
            compressionMethod: 'manual',
            maxSize: COMPRESSED_MAX_SIZE,
            minimumFileSizeForCompress: COMPRESSED_MIN_SIZE_BYTES,
            bitrate: 950_000,
            progressDivider: 5,
          },
          () => {},
        );

        const normalizedFileName = `analysis-${Date.now()}.mp4`;
        setCompressedVideoUri(compressedUri);
        setProcessingLabel('Compression complete. Uploading clip...');
        await hydrateVideoDetails(compressedUri, {
          fileName: normalizedFileName,
          fileType: 'video/mp4',
        });

        cleanupAnalysisRef.current?.();
        cleanupAnalysisRef.current =
          (await analyzeVideo({
            fileType: 'video/mp4',
            exercise: supportedExercise,
            fileURI: compressedUri,
          })) ?? null;
      } catch {
        showErrorAlert('Compression failed', 'Unable to compress this video right now.');
      } finally {
        setIsCompressing(false);
      }
    },
    [analysisLoading, analyzeVideo, hydrateVideoDetails, selectedExercise?.exercise],
  );

  useEffect(() => {
    cleanupAnalysisRef.current?.();
    cleanupAnalysisRef.current = null;
    setSelectedRepIndex(0);

    if (cachedAnalysis) {
      lastCachedCompletedRef.current =
        cachedAnalysis.status === 'completed' ? cachedAnalysis : lastCachedCompletedRef.current;
      setProcessingLabel(
        cachedAnalysis.status === 'completed' ? 'Analysis finished. Explore each repetition below.' : '',
      );
      return;
    }

    setSelectedVideo(null);
    resetProcessedVideoState();
    setProcessingLabel('');
    resetAnalysis();
    if (analysisOverview.exerciseId === selectedExercise?.id && analysisOverview.status !== 'processing') {
      markAnalysisIdle();
    }
  }, [cachedAnalysis, markAnalysisIdle, resetAnalysis, selectedExercise?.id, resetProcessedVideoState]);

  useEffect(() => {
    const finishSubscription = VideoTrim.onFinishTrimming?.((event: TrimFinishEvent) => {
      setIsAwaitingTrimResult(false);
      const trimmedDurationMs = Math.max(0, event.endTime - event.startTime);

      if (trimmedDurationMs > MAX_TRIM_DURATION_MS) {
        showErrorAlert('Clip too long', 'Please trim the video to 30 seconds or less.');
        if (selectedVideo?.uri) {
          openTrimEditor(selectedVideo.uri);
        }
        return;
      }

      setTrimmedVideoUri(event.outputPath);
      setCompressedVideoUri(null);
      setProcessingLabel('Video trimmed. Starting compression...');
      void hydrateVideoDetails(event.outputPath).then(() => handleCompressAndAnalyze(event.outputPath));
    });

    const cancelSubscription = VideoTrim.onCancel?.(() => {
      setIsAwaitingTrimResult(false);
      resetProcessedVideoState();
      setProcessingLabel('');

      if (selectedExercise?.id) {
        onCacheAnalysis(selectedExercise.id, null, {
          exerciseId: null,
          exerciseName: null,
          status: 'idle',
          resultCount: 0,
        });
      }

      markAnalysisIdle();
    });

    const errorSubscription = VideoTrim.onError?.((event: TrimErrorEvent) => {
      setIsAwaitingTrimResult(false);
      resetProcessedVideoState();
      markAnalysisIdle();
      showErrorAlert('Trim failed', event.message || 'Unable to trim this video.');
    });

    return () => {
      finishSubscription?.remove?.();
      cancelSubscription?.remove?.();
      errorSubscription?.remove?.();
    };
  }, [
    handleCompressAndAnalyze,
    hydrateVideoDetails,
    markAnalysisIdle,
    onCacheAnalysis,
    openTrimEditor,
    resetProcessedVideoState,
    selectedExercise?.id,
    selectedVideo?.uri,
  ]);

  useEffect(() => {
    return () => {
      cleanupAnalysisRef.current?.();
      cleanupAnalysisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!selectedExercise?.id) return;

    if (isCompressing || phase !== 'idle') {
      const nextOverview: ExerciseAnalysisOverview = {
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.exercise,
        status: 'processing',
        resultCount: 0,
      };
      syncAnalysisOverview(nextOverview);
      return;
    }

    if (analysisResults?.status === 'completed') {
      const nextOverview: ExerciseAnalysisOverview = {
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.exercise,
        status: 'completed',
        resultCount: analysisResults.result.length,
      };
      syncAnalysisOverview(nextOverview);
      onCacheAnalysis(selectedExercise.id, analysisResults, nextOverview);
      return;
    }

    if (analysisResults?.status === 'failed') {
      const nextOverview: ExerciseAnalysisOverview = {
        exerciseId: selectedExercise.id,
        exerciseName: selectedExercise.exercise,
        status: 'failed',
        resultCount: 0,
      };
      syncAnalysisOverview(nextOverview);
      onCacheAnalysis(selectedExercise.id, analysisResults, nextOverview);
    }
  }, [
    analysisResults,
    isCompressing,
    onCacheAnalysis,
    phase,
    selectedExercise?.exercise,
    selectedExercise?.id,
    syncAnalysisOverview,
  ]);

  useEffect(() => {
    if (analysisResults?.status === 'completed') {
      lastCachedCompletedRef.current = analysisResults;
      setProcessingLabel('Analysis finished. Explore each repetition below.');
      return;
    }

    if (analysisResults?.status === 'failed') {
      setProcessingLabel('Analysis failed. You can trim again or try another clip.');
      return;
    }

    if (phase === 'uploading') {
      setProcessingLabel(uploadProgress > 0 ? `Uploading video... ${uploadProgress}%` : 'Uploading video...');
      return;
    }

    if (phase === 'publishing') {
      setProcessingLabel('Starting your AI analysis...');
      return;
    }

    if (phase === 'waiting_results') {
      setProcessingLabel('AI is reviewing your movement now...');
      return;
    }

    if (!isCompressing && !isAwaitingTrimResult) {
      setProcessingLabel('');
    }
  }, [analysisResults?.status, isAwaitingTrimResult, isCompressing, phase, uploadProgress]);

  useEffect(() => {
    if (analysisResults?.status === 'completed') {
      setSelectedRepIndex(0);
      setProcessingLabel('Analysis finished. Explore each repetition below.');
    }
  }, [analysisResults]);

  const handlePickVideo = useCallback(async () => {
    if (isPickingVideo || isCompressing || analysisLoading) {
      return;
    }

    try {
      setIsPickingVideo(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        showErrorAlert('Permission needed', 'Please allow access to your media library to choose a video.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',
        allowsMultipleSelection: false,
        videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
        quality: 0.3,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      if ((asset.fileSize ?? 0) > MAX_VIDEO_BYTES) {
        showErrorAlert('Video too large', 'Please choose a video smaller than 100 MB.');
        return;
      }

      resetAnalysis();
      resetProcessedVideoState();
      setProcessingLabel('Video selected. Opening trim screen...');
      if (selectedExercise?.id) {
        onCacheAnalysis(selectedExercise.id, null, {
          exerciseId: selectedExercise.id,
          exerciseName: selectedExercise.exercise,
          status: 'processing',
          resultCount: 0,
        });
      }

      await hydrateVideoDetails(asset.uri, {
        fileName: asset.fileName ?? `analysis-${Date.now()}.mp4`,
        fileType: asset.mimeType ?? 'video/mp4',
        sizeBytes: asset.fileSize ?? null,
        durationMs: asset.duration ?? null,
      });
      openTrimEditor(asset.uri);
    } catch (error) {
      console.log('Video picker failed:', error);
      showErrorAlert('Video picker error', 'Unable to open the video picker right now.');
    } finally {
      setIsPickingVideo(false);
    }
  }, [
    analysisLoading,
    hydrateVideoDetails,
    isCompressing,
    isPickingVideo,
    onCacheAnalysis,
    openTrimEditor,
    resetAnalysis,
    resetProcessedVideoState,
    selectedExercise?.exercise,
    selectedExercise?.id,
  ]);

  const handleTrimVideo = useCallback(() => {
    if (!selectedVideo?.uri) {
      showErrorAlert('No video selected', 'Choose a video first.');
      return;
    }

    openTrimEditor(selectedVideo.uri);
  }, [openTrimEditor, selectedVideo?.uri]);

  const handleCancelCurrentAnalysis = useCallback(() => {
    cancelAnalysis();
    setProcessingLabel('Analysis canceled.');
    markAnalysisIdle();
  }, [cancelAnalysis, markAnalysisIdle]);

  const visibleAnalysis = analysisResults ?? cachedAnalysis;
  const resultSummary = useMemo(() => {
    if (!visibleAnalysis) return null;
    if (visibleAnalysis.status === 'failed') return visibleAnalysis.error;
    return `${visibleAnalysis.result.length} repetitions analyzed`;
  }, [visibleAnalysis]);

  const completedResults = useMemo(() => {
    if (visibleAnalysis?.status !== 'completed') return [];
    return visibleAnalysis.result;
  }, [visibleAnalysis]);
  const selectedRep: SquatRepetition | null = completedResults[selectedRepIndex] ?? null;
  const repsNeedingTorsoFix = useMemo(
    () => completedResults.filter((rep) => rep.back_lean.excessive).length,
    [completedResults],
  );
  const repsWithGoodDepth = useMemo(
    () => completedResults.filter((rep) => !rep.depth.status.toLowerCase().includes('high')).length,
    [completedResults],
  );
  const isBusy = isPickingVideo || isAwaitingTrimResult || isCompressing || analysisLoading;
  const showCancelAction = analysisLoading;

  useEffect(() => {
    if (visibleAnalysis?.status !== 'completed') return;

    const timeoutId = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 180);

    return () => clearTimeout(timeoutId);
  }, [selectedRepIndex, visibleAnalysis?.status]);

  if (!selectedExercise) {
    return (
      <AnalyzeEmptyState
        title="Choose an exercise to analyze"
        subtitle="Open the AI analysis action from an exercise card to get started."
      />
    );
  }

  return (
    <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <AnalyzeHeroSection copy={exerciseCopy} />
      <AnalyzeInfoSection selectedExercise={selectedExercise} />
      <AnalyzePrimaryAction
        hasSelectedVideo={!!selectedVideo}
        isBusy={isBusy}
        isPickingVideo={isPickingVideo}
        onPress={handlePickVideo}
      />
      <AnalyzeClipStatusCard
        selectedVideo={selectedVideo}
        trimmedVideoUri={trimmedVideoUri}
        compressedVideoUri={compressedVideoUri}
        formatDuration={formatDuration}
        formatBytesToMb={formatBytesToMb}
      />
      <AnalyzeActionsSection
        hasSelectedVideo={!!selectedVideo?.uri}
        isAwaitingTrimResult={isAwaitingTrimResult}
        isCompressing={isCompressing}
        analysisLoading={analysisLoading}
        showCancelAction={showCancelAction}
        onTrimAgain={handleTrimVideo}
        onCancelUpload={handleCancelCurrentAnalysis}
      />
      <AnalyzeProcessingCard processingLabel={processingLabel} phase={phase} uploadProgress={uploadProgress} />
      {visibleAnalysis && resultSummary ? (
        <AnalyzeResultsSection
          visibleAnalysis={visibleAnalysis}
          resultSummary={resultSummary}
          selectedExercise={selectedExercise}
          exerciseCopy={exerciseCopy}
          completedResults={completedResults}
          selectedRepIndex={selectedRepIndex}
          selectedRep={selectedRep}
          repsWithGoodDepth={repsWithGoodDepth}
          repsNeedingTorsoFix={repsNeedingTorsoFix}
          onSelectRep={setSelectedRepIndex}
          formatConfidence={formatConfidence}
        />
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 14,
  },
});

export default AnalyzeExerciseSheet;


