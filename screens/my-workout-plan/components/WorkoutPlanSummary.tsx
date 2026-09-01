import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';
import { getDaysSince } from '../../../shared/utils/shared-utils';
import type { MyWorkoutPlanReturn } from '../hooks/use-my-workout-plan.hook';
import { calculateWeeklyProgress } from '../utils/my-workout-plan.utils';

type PlanData = MyWorkoutPlanReturn['data'];
type Props = {
  data: PlanData;
  split: NonNullable<PlanData['selectedSplit']>;
  onStart: MyWorkoutPlanReturn['actions']['startWorkout'];
  onEdit: MyWorkoutPlanReturn['actions']['editPlan'];
};

const WorkoutPlanSummary = ({ data, split, onStart, onEdit }: Props) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const common = createSharedComponentStyles(data.theme);
  const progress = calculateWeeklyProgress(data.completedThisWeek, data.weeklyTarget);
  const lastDone = data.lastCompletedDate ? getDaysSince(data.lastCompletedDate) : null;

  return (
    <View style={[styles.card, { backgroundColor: data.theme.heroSurface }]}>
      <Text style={[styles.mutedText, styles.label, { color: data.theme.white }]}>CURRENT SPLIT</Text>
      <View style={styles.titleRow}>
        <Text numberOfLines={1} style={[styles.title, { color: data.theme.white }]}>{split.name}</Text>
        <View style={[styles.status, { borderColor: data.theme.primary }]}>
          <Text style={[styles.statusText, { color: data.theme.white }]}>{data.hasTrainedToday ? 'DONE TODAY' : 'READY'}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <Metric theme={data.theme} icon="dumbbell" text={`${split.exercises.length} exercises`} />
        <Text style={[styles.dividerText, { color: data.theme.white }]}>·</Text>
        <Metric theme={data.theme} icon="layers-outline" text={`${data.setCount} sets`} />
        {split.estimatedDurationMinutes != null && (
          <><Text style={[styles.dividerText, { color: data.theme.white }]}>·</Text><Metric theme={data.theme} icon="clock-outline" text={`~${Math.round(split.estimatedDurationMinutes)} min`} /></>
        )}
      </View>

      {data.weeklyTarget > 0 && (
        <View style={styles.progressBlock}>
          <View style={styles.progressLabels}>
            <Text style={[styles.mutedText, styles.progressLabel, { color: data.theme.white }]}>WEEKLY GOAL</Text>
            <Text style={[styles.mutedText, styles.progressValue, { color: data.theme.white }]}>{data.completedThisWeek} of {data.weeklyTarget}</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: data.theme.border }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: data.theme.primary }]} />
          </View>
        </View>
      )}

      <View style={styles.weekRow}>
        {data.weekDays.map((day) => (
          <View key={day.date} style={styles.day}>
            <Text style={[styles.mutedText, styles.dayLabel, { color: data.theme.white }]}>{day.label}</Text>
            <View style={[styles.todayRing, day.isToday && { borderColor: data.theme.white }]}>
              <View style={[styles.dayDot, { borderColor: data.theme.border }, day.trained && { backgroundColor: data.theme.primary, borderColor: data.theme.primary }]} />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.lastDoneRow}>
        <MaterialCommunityIcons name="calendar-blank-outline" size={fontSizes.body} color={data.theme.white} style={styles.mutedIcon} />
        <Text style={[styles.mutedText, styles.lastDone, { color: data.theme.white }]}>{lastDone ? `Last done ${lastDone.toLowerCase()}` : 'No previous workout'}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable disabled={data.hasTrainedToday} onPress={onStart} style={({ pressed }) => [common.primaryButton, styles.startButton, { opacity: data.hasTrainedToday ? 0.5 : pressed ? 0.84 : 1 }]}>
          <MaterialCommunityIcons name="play" size={fontSizes.title} color={data.theme.white} />
          <Text style={[common.primaryButtonText, styles.startText]}>{data.hasTrainedToday ? 'Completed today' : 'Start workout'}</Text>
        </Pressable>
        <Pressable onPress={onEdit} style={({ pressed }) => [styles.editButton, { borderColor: data.theme.border }, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="pencil-outline" size={fontSizes.title} color={data.theme.white} />
          <Text style={[styles.editText, { color: data.theme.white }]}>Edit</Text>
        </Pressable>
      </View>
    </View>
  );
};

const Metric = ({ theme, icon, text }: { theme: PlanData['theme']; icon: 'dumbbell' | 'layers-outline' | 'clock-outline'; text: string }) => (
  <View style={metricStyles.container}><MaterialCommunityIcons name={icon} size={fontSizes.body} color={theme.white} style={metricStyles.muted} /><Text style={[metricStyles.text, { color: theme.white }]}>{text}</Text></View>
);

const metricStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  muted: { opacity: 0.68 },
  text: { opacity: 0.68, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
});

const createStyles = (width: number, height: number) => {
  const padding = Math.max(16, Math.min(width * 0.05, 22));
  const buttonHeight = Math.max(48, Math.min(height * 0.064, 54));
  const dot = Math.max(15, Math.min(width * 0.043, 18));
  return StyleSheet.create({
    card: { borderRadius: Math.max(22, Math.min(width * 0.07, 28)), padding },
    mutedText: { opacity: 0.68 },
    label: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 1.2 },
    titleRow: { marginTop: Math.max(8, height * 0.011), flexDirection: 'row', alignItems: 'center', gap: Math.max(9, width * 0.03) },
    title: { flexShrink: 1, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
    status: { borderWidth: 1, borderRadius: 10, paddingHorizontal: Math.max(8, width * 0.025), paddingVertical: Math.max(4, height * 0.006) },
    statusText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 0.8 },
    metrics: { marginTop: Math.max(11, height * 0.016), flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Math.max(5, width * 0.018) },
    dividerText: { opacity: 0.38 },
    progressBlock: { marginTop: Math.max(14, height * 0.021) },
    progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Math.max(5, height * 0.008) },
    progressLabel: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 0.8 },
    progressValue: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption },
    progressTrack: { height: Math.max(3, height * 0.004), borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 2 },
    weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Math.max(13, height * 0.019) },
    day: { alignItems: 'center', gap: Math.max(4, height * 0.006) },
    dayLabel: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption },
    todayRing: { width: dot + 8, height: dot + 8, borderRadius: (dot + 8) / 2, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
    dayDot: { width: dot, height: dot, borderRadius: dot / 2, borderWidth: 1.5 },
    lastDoneRow: { marginTop: Math.max(12, height * 0.018), flexDirection: 'row', alignItems: 'center', gap: Math.max(5, width * 0.018) },
    mutedIcon: { opacity: 0.68 },
    lastDone: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
    actions: { marginTop: Math.max(14, height * 0.021), flexDirection: 'row', gap: Math.max(7, width * 0.022) },
    startButton: { minHeight: buttonHeight, flex: 1, justifyContent: 'center', gap: 7, borderRadius: Math.max(15, width * 0.04) },
    startText: { flex: 0, marginLeft: 0 },
    editButton: { minHeight: buttonHeight, minWidth: Math.max(82, width * 0.22), paddingHorizontal: Math.max(12, width * 0.035), borderRadius: Math.max(15, width * 0.04), borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
    editText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    pressed: { opacity: 0.72 },
  });
};

export default WorkoutPlanSummary;
