import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type Day = {
  label: string;
  date: string;
  name: string;
  startTime: string;
  isToday: boolean;
  completed: boolean;
  durationMinutes?: number | null;
};
type Props = {
  hasSchedule: boolean;
  completedThisWeek: number;
  weeklyTarget: number;
  totalWorkouts: number;
  weekDays: Day[];
  theme: AppThemeColors;
  onManage: () => void;
};

const TrainingOverviewCard = (props: Props) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  return (
    <View>
      {props.hasSchedule ? <ScheduledOverview {...props} styles={styles} /> : <SchedulePrompt {...props} styles={styles} />}
      <View style={[styles.totalFooter, { borderTopColor: props.theme.border }]}>
        <Text style={[styles.totalValue, { color: props.theme.textPrimary }]}>{props.totalWorkouts}</Text>
        <View style={styles.totalCopy}>
          <Text style={[styles.totalLabel, { color: props.theme.textPrimary }]}>Total workouts</Text>
          <Text style={[styles.totalInline, { color: props.theme.textSecondary }]}>All time · scheduled + extra</Text>
        </View>
      </View>
    </View>
  );
};

const ScheduledOverview = ({ weekDays, theme, onManage, styles }: Props & { styles: Styles }) => {
  const completedThisWeek = weekDays.filter((day) => day.completed).length;
  const weeklyTarget = weekDays.length;
  const progress = weeklyTarget > 0 ? Math.min(completedThisWeek / weeklyTarget, 1) : 0;
  const plannedDays = weekDays.filter((day) => day.name);
  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>This week’s schedule</Text>
        <Pressable accessibilityRole="button" onPress={onManage} hitSlop={10}>
          <Text style={[styles.link, { color: theme.primary }]}>Manage</Text>
        </Pressable>
      </View>
      <Text style={[styles.scopeText, { color: theme.textSecondary }]}>Your scheduled workouts. Extra sessions appear in History.</Text>
      <View style={styles.summary}>
        <View style={styles.weeklySummary}>
          <View accessible accessibilityRole="progressbar" accessibilityLabel="Scheduled workouts completed" accessibilityValue={{ min: 0, max: weeklyTarget, now: completedThisWeek }}>
            <Svg width={64} height={64}>
              <Circle cx={32} cy={32} r={29} fill="none" stroke={theme.surfaceMuted} strokeWidth={4} />
              {progress > 0 ? <Circle cx={32} cy={32} r={29} fill="none" stroke={theme.primary} strokeWidth={4} strokeDasharray={`${2 * Math.PI * 29} ${2 * Math.PI * 29}`} strokeDashoffset={2 * Math.PI * 29 * (1 - progress)} strokeLinecap="round" rotation={-90} origin="32, 32" /> : null}
            </Svg>
          </View>
          <View style={styles.weeklyCopy}>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
              {completedThisWeek} of {weeklyTarget} completed
            </Text>
            <Text style={[styles.caption, { color: theme.textSecondary }]}>scheduled workouts this week</Text>
          </View>
        </View>
      </View>
      <View style={styles.list}>
        {plannedDays.map((day, index) => (
          <WorkoutDayRow key={`${day.date}-${index}`} day={day} last={index === plannedDays.length - 1} theme={theme} styles={styles} />
        ))}
      </View>
    </>
  );
};

const WorkoutDayRow = ({ day, last, theme, styles }: { day: Day; last: boolean; theme: AppThemeColors; styles: Styles }) => {
  const date = DateTime.fromISO(day.date);
  const dayLabel = day.isToday ? 'Today' : date.toFormat('ccc');
  const detail =
    day.completed ? `Completed${day.durationMinutes ? ` · ${day.durationMinutes} min` : ''}` : day.startTime || 'Any time';
  return (
    <View style={[styles.dayRow, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border }]}>
      <View style={styles.dateColumn}>
        <Text style={[styles.dayLabel, { color: day.isToday ? theme.primary : theme.textSecondary }]}>{dayLabel}</Text>
        <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>{date.toFormat('d MMM')}</Text>
      </View>
      <View style={styles.workoutCopy}>
        <Text style={[styles.workoutName, { color: theme.textPrimary }]} numberOfLines={2}>{day.name}</Text>
        <Text style={[styles.dayDetail, { color: theme.textSecondary }]}>{detail}</Text>
      </View>
        {day.completed ? (
          <View accessible accessibilityLabel="Workout completed" style={styles.completedBadge}>
            <MaterialCommunityIcons name="check-circle-outline" size={24} color={theme.profit} />
          </View>
        ) : null}
    </View>
  );
};

const SchedulePrompt = ({ theme, onManage, styles }: Props & { styles: Styles }) => (
  <>
    <View style={styles.header}>
      <Text style={[styles.heading, { color: theme.textPrimary }]}>This week’s schedule</Text>
    </View>
    <View style={styles.prompt}>
      <MaterialCommunityIcons name="calendar-blank-outline" size={36} color={theme.textSecondary} />
      <Text style={[styles.promptTitle, { color: theme.textPrimary }]}>No workouts scheduled yet</Text>
      <Text style={[styles.promptText, { color: theme.textSecondary }]}>Choose your training days and times for workout reminders.</Text>
      <Pressable
        onPress={onManage}
        style={({ pressed }) => [styles.promptButton, { borderColor: theme.primary }, pressed && styles.pressed]}
      >
        <Text style={[styles.promptButtonText, { color: theme.primary }]}>Set schedule</Text>
      </Pressable>
    </View>
  </>
);

type Styles = ReturnType<typeof createStyles>;
const createStyles = (width: number, height: number) => {
  return StyleSheet.create({
    header: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' },
    scopeText: { marginTop: 7, fontFamily: fontFamilies.regular, fontSize: fontSizes.label, lineHeight: 19 },
    totalFooter: {
      marginTop: 8,
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    heading: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
    link: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    summary: {
      marginTop: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    weeklySummary: { flex: 1.5, minWidth: 0, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 14 },
    weeklyCopy: { flexShrink: 1 },
    completedBadge: { width: 32, flexShrink: 0, alignItems: 'flex-end', justifyContent: 'center' },
    summaryValue: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body, fontVariant: ['tabular-nums'] },
    caption: { marginTop: 1, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
    list: { marginTop: 16 },
    dayRow: { minHeight: 72, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
    dateColumn: { width: 64 },
    dayLabel: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
    dateLabel: { marginTop: 4, fontFamily: fontFamilies.regular, fontSize: fontSizes.label, fontVariant: ['tabular-nums'] },
    workoutCopy: { flex: 1, minWidth: 0, gap: 4 },
    workoutName: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body },
    dayDetail: { flexShrink: 1, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
    totalInline: { flexShrink: 1, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
    totalValue: { flexShrink: 1, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, fontVariant: ['tabular-nums'] },
    totalCopy: { flex: 1, gap: 4 },
    totalLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    prompt: { paddingVertical: Math.max(24, Math.min(height * 0.038, 34)), alignItems: 'center' },
    promptTitle: { marginTop: 14, textAlign: 'center', fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
    promptText: {
      maxWidth: 310,
      marginTop: 7,
      textAlign: 'center',
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.bodySmall,
      lineHeight: fontSizes.title,
    },
    promptButton: {
      minHeight: Math.max(46, Math.min(height * 0.06, 52)),
      marginTop: 18,
      paddingHorizontal: Math.max(22, width * 0.07),
      borderRadius: 15,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    promptButtonText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    pressed: { opacity: 0.72 },
  });
};
export default TrainingOverviewCard;
