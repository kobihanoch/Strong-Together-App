import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../../../shared/constants/colors';
import { AnalyzeVideoResultPayload, SquatRepetition } from '@strong-together/shared';
import { ExerciseInPlan } from '@strong-together/shared';

export type ExerciseAnalysisCopy = {
  heroTitle: string;
  heroSubtitle: string;
  summaryPrimaryLabel: string;
  summarySecondaryLabel: string;
  primaryMetricLabel: string;
  secondaryMetricLabel: string;
  repLabel: string;
  confidenceTitle: string;
};

type VideoSelectionState = {
  fileName: string;
  sizeBytes: number | null;
  durationMs: number | null;
};

export const AnalyzeEmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <View style={styles.emptyState}>
    <MaterialCommunityIcons name="brain" size={RFValue(24)} color={colors.primary} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitleCentered}>{subtitle}</Text>
  </View>
);

export const AnalyzeHeroSection = ({ copy }: { copy: ExerciseAnalysisCopy }) => (
  <View style={styles.heroCard}>
    <View style={styles.iconBadge}>
      <MaterialCommunityIcons name="brain" size={RFValue(22)} color={colors.primary} />
    </View>
    <View style={styles.heroTextWrap}>
      <Text style={styles.eyebrow}>AI ANALYZE</Text>
      <Text style={styles.title}>{copy.heroTitle}</Text>
      <Text style={styles.subtitle}>{copy.heroSubtitle}</Text>
    </View>
  </View>
);

export const AnalyzeInfoSection = ({ selectedExercise }: { selectedExercise: ExerciseInPlan }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>Target muscle</Text>
      <Text style={styles.infoValue}>{selectedExercise.targetmuscle ?? 'Unknown'}</Text>
    </View>
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>Clip limit</Text>
      <Text style={styles.infoValue}>30 sec max</Text>
    </View>
  </View>
);

export const AnalyzePrimaryAction = ({
  hasSelectedVideo,
  isBusy,
  isPickingVideo,
  onPress,
}: {
  hasSelectedVideo: boolean;
  isBusy: boolean;
  isPickingVideo: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.primaryAction, isBusy && styles.disabledPrimaryAction]} onPress={onPress} disabled={isBusy}>
    {isPickingVideo ? (
      <ActivityIndicator color={colors.white} />
    ) : (
      <MaterialCommunityIcons name="video-plus-outline" size={RFValue(18)} color={colors.white} />
    )}
    <Text style={styles.primaryActionText}>{hasSelectedVideo ? 'Choose another video' : 'Choose video from phone'}</Text>
  </TouchableOpacity>
);

export const AnalyzeClipStatusCard = ({
  selectedVideo,
  trimmedVideoUri,
  compressedVideoUri,
  formatDuration,
  formatBytesToMb,
}: {
  selectedVideo: VideoSelectionState | null;
  trimmedVideoUri: string | null;
  compressedVideoUri: string | null;
  formatDuration: (durationMs: number | null | undefined) => string;
  formatBytesToMb: (bytes: number | null | undefined) => string;
}) => (
  <View style={styles.statusCard}>
    <Text style={styles.sectionTitle}>Selected clip</Text>
    <Text style={styles.statusLine}>
      Source: <Text style={styles.statusValue}>{selectedVideo?.fileName ?? 'No video selected yet'}</Text>
    </Text>
    <Text style={styles.statusLine}>
      Duration: <Text style={styles.statusValue}>{formatDuration(selectedVideo?.durationMs)}</Text>
    </Text>
    <Text style={styles.statusLine}>
      Size: <Text style={styles.statusValue}>{formatBytesToMb(selectedVideo?.sizeBytes)}</Text>
    </Text>
    {trimmedVideoUri ? (
      <Text style={styles.statusLine}>
        Trimmed clip: <Text style={styles.statusValue}>Ready for analysis</Text>
      </Text>
    ) : null}
    {compressedVideoUri ? (
      <Text style={styles.statusLine}>
        Upload format: <Text style={styles.statusValue}>Compressed MP4</Text>
      </Text>
    ) : null}
  </View>
);

export const AnalyzeActionsSection = ({
  hasSelectedVideo,
  isAwaitingTrimResult,
  isCompressing,
  analysisLoading,
  showCancelAction,
  onTrimAgain,
  onCancelUpload,
}: {
  hasSelectedVideo: boolean;
  isAwaitingTrimResult: boolean;
  isCompressing: boolean;
  analysisLoading: boolean;
  showCancelAction: boolean;
  onTrimAgain: () => void;
  onCancelUpload: () => void;
}) => (
  <View style={styles.actionsColumn}>
    <TouchableOpacity
      style={[styles.secondaryAction, !hasSelectedVideo && styles.disabledAction]}
      onPress={onTrimAgain}
      disabled={!hasSelectedVideo || isAwaitingTrimResult || isCompressing || analysisLoading}
    >
      <MaterialCommunityIcons name="content-cut" size={RFValue(16)} color={colors.primary} />
      <Text style={styles.secondaryActionText}>
        {isAwaitingTrimResult ? 'Waiting for trim...' : isCompressing || analysisLoading ? 'Processing clip...' : 'Trim again'}
      </Text>
    </TouchableOpacity>

    {showCancelAction ? (
      <TouchableOpacity style={styles.cancelAction} onPress={onCancelUpload}>
        <MaterialCommunityIcons name="close-circle-outline" size={RFValue(16)} color={colors.error || '#c62828'} />
        <Text style={styles.cancelActionText}>Cancel current upload</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export const AnalyzeProcessingCard = ({
  processingLabel,
  phase,
  uploadProgress,
}: {
  processingLabel: string;
  phase: 'idle' | 'uploading' | 'publishing' | 'waiting_results';
  uploadProgress: number;
}) => {
  if (!processingLabel) return null;

  return (
    <View style={styles.feedbackCard}>
      <Text style={styles.feedbackText}>{processingLabel}</Text>
      {phase === 'uploading' ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(uploadProgress, 4)}%` }]} />
        </View>
      ) : null}
    </View>
  );
};

export const AnalyzeResultsSection = ({
  visibleAnalysis,
  resultSummary,
  selectedExercise,
  exerciseCopy,
  completedResults,
  selectedRepIndex,
  selectedRep,
  repsWithGoodDepth,
  repsNeedingTorsoFix,
  onSelectRep,
  formatConfidence,
}: {
  visibleAnalysis: AnalyzeVideoResultPayload<SquatRepetition>;
  resultSummary: string;
  selectedExercise: ExerciseInPlan;
  exerciseCopy: ExerciseAnalysisCopy;
  completedResults: SquatRepetition[];
  selectedRepIndex: number;
  selectedRep: SquatRepetition | null;
  repsWithGoodDepth: number;
  repsNeedingTorsoFix: number;
  onSelectRep: (index: number) => void;
  formatConfidence: (value: number | null | undefined) => string;
}) => {
  if (!resultSummary) return null;

  return (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.sectionTitle}>Analysis result</Text>
        {visibleAnalysis.status === 'completed' ? (
          <View style={styles.readyBadge}>
            <MaterialCommunityIcons name="star-four-points" size={RFValue(12)} color={colors.completedDark} />
            <Text style={styles.readyBadgeText}>Ready</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.resultText}>{resultSummary}</Text>
      {visibleAnalysis.status === 'completed' && selectedRep ? (
        <>
          <Text style={styles.resultMeta}>
            Latest result for {selectedExercise.exercise}. Tap a {exerciseCopy.repLabel.toLowerCase()} to review the coaching takeaways.
          </Text>
          <View style={styles.summaryStrip}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillLabel}>{exerciseCopy.summaryPrimaryLabel}</Text>
              <Text style={styles.summaryPillValue}>
                {repsWithGoodDepth}/{completedResults.length}
              </Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillLabel}>{exerciseCopy.summarySecondaryLabel}</Text>
              <Text style={styles.summaryPillValue}>{repsNeedingTorsoFix}</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.repSelectorRow}>
            {completedResults.map((_, index) => (
              <TouchableOpacity
                key={`rep-${index + 1}`}
                style={[styles.repChip, index === selectedRepIndex && styles.repChipActive]}
                onPress={() => onSelectRep(index)}
              >
                <Text style={[styles.repChipText, index === selectedRepIndex && styles.repChipTextActive]}>
                  {exerciseCopy.repLabel} {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.metricGrid}>
            <View style={[styles.metricCard, styles.metricCardPrimary]}>
              <View style={styles.metricIconWrap}>
                <MaterialCommunityIcons name="arrow-collapse-down" size={RFValue(18)} color={colors.primary} />
              </View>
              <Text style={styles.metricLabel}>{exerciseCopy.primaryMetricLabel}</Text>
              <Text style={styles.metricValue}>{selectedRep.depth.status}</Text>
              <Text style={styles.metricSubValue}>{selectedRep.depth.value.toFixed(1)} deg</Text>
            </View>
            <View style={[styles.metricCard, styles.metricCardSecondary]}>
              <View style={styles.metricIconWrap}>
                <MaterialCommunityIcons name="human-male-height" size={RFValue(18)} color={colors.completedDark} />
              </View>
              <Text style={styles.metricLabel}>{exerciseCopy.secondaryMetricLabel}</Text>
              <Text style={styles.metricValue}>{selectedRep.back_lean.excessive ? 'Excessive' : 'Controlled'}</Text>
              <Text style={styles.metricSubValue}>{selectedRep.back_lean.value.toFixed(1)} deg</Text>
            </View>
          </View>
          <View style={styles.confidenceCard}>
            <View style={styles.confidenceHeader}>
              <Text style={styles.confidenceTitle}>{exerciseCopy.confidenceTitle}</Text>
              <View style={styles.confidenceHeaderBadge}>
                <MaterialCommunityIcons name="shield-check-outline" size={RFValue(12)} color={colors.completedDark} />
                <Text style={styles.confidenceHeaderBadgeText}>AI scored</Text>
              </View>
            </View>
            <View style={styles.confidenceRow}>
              <Text style={styles.confidencePill}>Depth confidence {formatConfidence(selectedRep.depth.confidence)}</Text>
              <Text style={styles.confidencePill}>Torso confidence {formatConfidence(selectedRep.back_lean.confidence)}</Text>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 10,
  },
  heroCard: {
    gap: 14,
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#f5f8ff',
    borderWidth: 1,
    borderColor: 'rgba(41, 121, 255, 0.10)',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextWrap: {
    gap: 8,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(10),
    color: colors.primary,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(18),
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
    color: colors.textSecondary,
    lineHeight: 20,
  },
  subtitleCentered: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  infoCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: 16,
    backgroundColor: colors.lightCardBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 4,
  },
  infoLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(11),
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(13),
    color: colors.textPrimary,
  },
  primaryAction: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  disabledPrimaryAction: {
    opacity: 0.55,
  },
  primaryActionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(12),
    color: colors.white,
  },
  statusCard: {
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(13),
    color: colors.textPrimary,
  },
  statusLine: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(11),
    color: colors.textSecondary,
  },
  statusValue: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.textPrimary,
  },
  actionsColumn: {
    gap: 10,
  },
  secondaryAction: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  disabledAction: {
    opacity: 0.45,
  },
  secondaryActionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(11),
    color: colors.primary,
  },
  cancelAction: {
    backgroundColor: '#fff4f4',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#ffd6d6',
  },
  cancelActionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(11),
    color: '#c62828',
  },
  feedbackCard: {
    borderRadius: 16,
    backgroundColor: '#f8fbff',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: 14,
  },
  feedbackText: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(11),
    color: colors.textPrimary,
  },
  progressTrack: {
    marginTop: 12,
    width: '100%',
    height: 8,
    backgroundColor: '#dfeffc',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  resultCard: {
    borderRadius: 22,
    backgroundColor: '#f7fffb',
    borderWidth: 1,
    borderColor: '#ccefdc',
    padding: 16,
    gap: 10,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  resultText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(13),
    color: colors.completedDark,
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eefbf4',
  },
  readyBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(10),
    color: colors.completedDark,
  },
  resultMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(10),
    color: colors.textSecondary,
  },
  summaryStrip: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  summaryPill: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d7f2e2',
    gap: 4,
  },
  summaryPillLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(10),
    color: colors.textSecondary,
  },
  summaryPillValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(14),
    color: colors.completedDark,
  },
  repSelectorRow: {
    gap: 10,
    paddingTop: 4,
    paddingBottom: 2,
  },
  repChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#ccefdc',
  },
  repChipActive: {
    backgroundColor: colors.completedDark,
    borderColor: colors.completedDark,
  },
  repChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(11),
    color: colors.completedDark,
  },
  repChipTextActive: {
    color: colors.white,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#d7f2e2',
  },
  metricCardPrimary: {
    backgroundColor: '#f7fbff',
    borderColor: '#dceafe',
  },
  metricCardSecondary: {
    backgroundColor: '#f7fffb',
    borderColor: '#d7f2e2',
  },
  metricIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(10),
    color: colors.textSecondary,
  },
  metricValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: RFValue(14),
    color: colors.completedDark,
  },
  metricSubValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(11),
    color: colors.textPrimary,
  },
  confidenceCard: {
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#d7f2e2',
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  confidenceTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(12),
    color: colors.textPrimary,
  },
  confidenceHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eefbf4',
  },
  confidenceHeaderBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(10),
    color: colors.completedDark,
  },
  confidenceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  confidencePill: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(10),
    color: colors.completedDark,
    backgroundColor: '#f4fff8',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d7f2e2',
  },
});
