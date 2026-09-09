import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Video as VideoCompressor } from 'react-native-compressor';
import VideoTrim, { showEditor } from 'react-native-video-trim';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { showErrorAlert } from '../../../shared/alerts/error-alerts';
import { colors } from '../../../shared/constants/colors';
import { getSupportedAnalysisExerciseName } from '../constants/video-analysis.constant';
import useVideoAnalysis from '../hooks/use-video-analysis.hook';
import { AnalysisIntro, AnalysisProcessing, SquatAnalysisResults, UploadVideoAction } from './AnalyzeExerciseSheetSections';

export type VideoAnalysisStatus = 'idle' | 'processing' | 'completed' | 'failed';

type Props = {
  exerciseName: string;
  theme: AppThemeColors;
  onStatusChange: (status: VideoAnalysisStatus) => void;
};

type TrimFinishEvent = { outputPath: string; startTime: number; endTime: number };
type TrimErrorEvent = { message: string };

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_TRIM_DURATION_MS = 30_000;

/** Owns the existing select → native trim → S3 upload → WebSocket result pipeline. */
const AnalyzeExerciseSheet = ({ exerciseName, theme, onStatusChange }: Props) => {
  const [isPicking, setIsPicking] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const selectedVideoRef = useRef<string | null>(null);
  const { loading, analyzeVideo, analysisResults, uploadProgress, phase, resetAnalysis } = useVideoAnalysis();
  const supportedExercise = getSupportedAnalysisExerciseName(exerciseName);
  const busy = isPicking || isTrimming || isCompressing || loading;

  const processVideo = useCallback(
    async (uri: string): Promise<void> => {
      if (!supportedExercise) return;
      try {
        setIsCompressing(true);
        const compressedUri = await VideoCompressor.compress(uri, {
          compressionMethod: 'manual',
          maxSize: 540,
          minimumFileSizeForCompress: 1024 * 1024,
          bitrate: 950_000,
          progressDivider: 5,
        });
        setIsCompressing(false);
        await analyzeVideo({ exercise: supportedExercise, fileType: 'video/mp4', fileURI: compressedUri });
      } catch (error) {
        setIsCompressing(false);
        console.log('[Video Analysis]: Compression failed.', error);
        showErrorAlert('Compression failed', 'Unable to prepare this video right now.');
      }
    },
    [analyzeVideo, supportedExercise],
  );

  useEffect(() => {
    const finishSubscription = VideoTrim.onFinishTrimming?.((event: TrimFinishEvent) => {
      setIsTrimming(false);
      if (event.endTime - event.startTime > MAX_TRIM_DURATION_MS) {
        showErrorAlert('Clip too long', 'Please trim the video to 30 seconds or less.');
        if (selectedVideoRef.current) openTrimEditor(selectedVideoRef.current);
        return;
      }
      void processVideo(event.outputPath);
    });
    const cancelSubscription = VideoTrim.onCancel?.(() => setIsTrimming(false));
    const errorSubscription = VideoTrim.onError?.((event: TrimErrorEvent) => {
      setIsTrimming(false);
      showErrorAlert('Trim failed', event.message || 'Unable to trim this video.');
    });

    return () => {
      finishSubscription?.remove?.();
      cancelSubscription?.remove?.();
      errorSubscription?.remove?.();
    };
  }, [processVideo]);

  useEffect(() => {
    if (analysisResults?.status === 'completed') onStatusChange('completed');
    else if (analysisResults?.status === 'failed') onStatusChange('failed');
    else if (isCompressing || phase !== 'idle') onStatusChange('processing');
    else onStatusChange('idle');
  }, [analysisResults?.status, isCompressing, onStatusChange, phase]);

  const openTrimEditor = (uri: string): void => {
    setIsTrimming(true);
    showEditor(uri, {
      maxDuration: MAX_TRIM_DURATION_MS,
      minDuration: 1_000,
      headerText: 'Trim up to 30 seconds',
      saveButtonText: 'Use clip',
      cancelButtonText: 'Cancel',
      trimmingText: 'Preparing clip…',
      trimmerColor: colors.primary,
      handleIconColor: colors.primaryDark,
      headerTextColor: colors.black,
    });
  };

  const pickVideo = async (): Promise<void> => {
    if (busy || !supportedExercise) return;
    try {
      setIsPicking(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        showErrorAlert('Permission needed', 'Allow photo-library access to upload a workout video.');
        return;
      }

      const selection = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'videos',
        allowsMultipleSelection: false,
        videoExportPreset: ImagePicker.VideoExportPreset.MediumQuality,
        quality: 0.3,
      });
      const video = selection.canceled ? null : selection.assets[0];
      if (!video) return;
      if ((video.fileSize ?? 0) > MAX_VIDEO_BYTES) {
        showErrorAlert('Video too large', 'Choose a video smaller than 100 MB.');
        return;
      }

      resetAnalysis();
      selectedVideoRef.current = video.uri;
      openTrimEditor(video.uri);
    } catch (error) {
      console.log('[Video Analysis]: Picker failed.', error);
      showErrorAlert('Upload unavailable', 'Unable to open your video library right now.');
    } finally {
      setIsPicking(false);
    }
  };

  const processingLabel = isTrimming
    ? 'Waiting for your trimmed clip…'
    : isCompressing
      ? 'Preparing the trimmed clip…'
      : phase === 'uploading'
        ? `Uploading to secure storage · ${uploadProgress}%`
        : 'Your video is uploaded. Waiting for the analysis result…';

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AnalysisIntro exerciseName={exerciseName} theme={theme} />
      {busy && !analysisResults ? (
        <AnalysisProcessing label={processingLabel} progress={phase === 'uploading' ? uploadProgress : null} theme={theme} />
      ) : analysisResults?.status === 'completed' ? (
        <>
          <SquatAnalysisResults results={analysisResults.result} theme={theme} />
          <UploadVideoAction busy={false} theme={theme} onPress={() => void pickVideo()} />
        </>
      ) : (
        <UploadVideoAction busy={isPicking} theme={theme} onPress={() => void pickVideo()} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({ content: { paddingHorizontal: 20, paddingBottom: 40, gap: 22 } });

export default AnalyzeExerciseSheet;
