import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { SquatRepetitionDto } from '@strong-together/shared';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

export const AnalysisIntro = ({ exerciseName, theme }: { exerciseName: string; theme: AppThemeColors }) => (
  <View>
    <Text style={[styles.eyebrow, { color: theme.primary }]}>MOVEMENT ANALYSIS</Text>
    <Text style={[styles.title, { color: theme.textPrimary }]}>{exerciseName}</Text>
    <Text style={[styles.body, { color: theme.textSecondary }]}>Choose a video, trim it to 30 seconds, and keep training while it is analyzed.</Text>
  </View>
);

export const UploadVideoAction = ({ busy, theme, onPress }: { busy: boolean; theme: AppThemeColors; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    disabled={busy}
    onPress={onPress}
    style={({ pressed }) => [styles.upload, { backgroundColor: theme.primary, opacity: busy ? 0.55 : pressed ? 0.84 : 1 }]}
  >
    {busy ? <ActivityIndicator color={theme.white} /> : <MaterialCommunityIcons name="upload-outline" size={21} color={theme.white} />}
    <Text style={[styles.uploadText, { color: theme.white }]}>{busy ? 'Preparing video…' : 'Upload video'}</Text>
  </Pressable>
);

export const AnalysisProcessing = ({ label, progress, theme }: { label: string; progress: number | null; theme: AppThemeColors }) => (
  <View style={[styles.processing, { backgroundColor: theme.primarySoft }]}>
    <View style={styles.processingRow}>
      <ActivityIndicator color={theme.primary} />
      <View style={styles.processingCopy}>
        <Text style={[styles.processingTitle, { color: theme.textPrimary }]}>Analysis in progress</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>{label}</Text>
      </View>
    </View>
    {progress !== null && (
      <View style={[styles.track, { backgroundColor: theme.surfaceMuted }]}>
        <View style={[styles.fill, { width: `${Math.max(3, progress)}%`, backgroundColor: theme.primary }]} />
      </View>
    )}
    <Text style={[styles.leaveHint, { color: theme.textSecondary }]}>You can close this sheet. Your workout and rest timer will continue.</Text>
  </View>
);

const confidence = (value: number) => `${Math.round(value * 100)}% confidence`;

export const SquatAnalysisResults = ({ results, theme }: { results: SquatRepetitionDto[]; theme: AppThemeColors }) => (
  <View style={styles.results}>
    <View style={styles.readyRow}>
      <View style={[styles.readyIcon, { backgroundColor: theme.primarySoft }]}>
        <MaterialCommunityIcons name="check" size={20} color={theme.primary} />
      </View>
      <View>
        <Text style={[styles.readyTitle, { color: theme.textPrimary }]}>Analysis ready</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>{results.length} repetitions detected</Text>
      </View>
    </View>

    {results.map((rep, index) => (
      <View key={index} style={[styles.rep, { borderTopColor: theme.border }]}>
        <Text style={[styles.repNumber, { color: theme.textPrimary }]}>REP {index + 1}</Text>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>DEPTH</Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>{rep.depth.status}</Text>
            <Text style={[styles.metricMeta, { color: theme.textSecondary }]}>{rep.depth.value.toFixed(1)}° · {confidence(rep.depth.confidence)}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>BACK LEAN</Text>
            <Text style={[styles.metricValue, { color: rep.backLean.excessive ? theme.achievement : theme.profit }]}>
              {rep.backLean.excessive ? 'Excessive' : 'Controlled'}
            </Text>
            <Text style={[styles.metricMeta, { color: theme.textSecondary }]}>{rep.backLean.value.toFixed(1)}° · {confidence(rep.backLean.confidence)}</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.audit}>
          <Text style={[styles.auditText, { color: theme.textSecondary, backgroundColor: theme.surfaceMuted }]}>{rep.audit.cameraAngle}</Text>
          <Text style={[styles.auditText, { color: theme.textSecondary, backgroundColor: theme.surfaceMuted }]}>{rep.audit.validFrames}/{rep.audit.framesAnalyzed} valid frames</Text>
          <Text style={[styles.auditText, { color: theme.textSecondary, backgroundColor: theme.surfaceMuted }]}>{rep.audit.samplingRate}</Text>
        </ScrollView>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.8 },
  title: { marginTop: 5, fontFamily: fontFamilies.bold, fontSize: fontSizes.title + 4, letterSpacing: -0.5 },
  body: { marginTop: 4, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, lineHeight: 19 },
  upload: { minHeight: 52, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  uploadText: { fontFamily: fontFamilies.bold, fontSize: fontSizes.bodySmall },
  processing: { padding: 18, borderRadius: 20 },
  processingRow: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  processingCopy: { flex: 1 },
  processingTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes.body },
  track: { height: 5, marginTop: 16, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  leaveHint: { marginTop: 12, fontFamily: fontFamilies.regular, fontSize: fontSizes.caption, lineHeight: 15 },
  results: { gap: 4 },
  readyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 10 },
  readyIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  readyTitle: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  rep: { paddingVertical: 17, borderTopWidth: StyleSheet.hairlineWidth },
  repNumber: { fontFamily: fontFamilies.bold, fontSize: fontSizes.caption, letterSpacing: 1.5 },
  metrics: { marginTop: 12, flexDirection: 'row', gap: 18 },
  metric: { flex: 1 },
  metricLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1 },
  metricValue: { marginTop: 4, fontFamily: fontFamilies.bold, fontSize: fontSizes.body },
  metricMeta: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.caption, lineHeight: 14 },
  audit: { paddingTop: 11, gap: 7 },
  auditText: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8, fontFamily: fontFamilies.medium, fontSize: fontSizes.caption },
});
