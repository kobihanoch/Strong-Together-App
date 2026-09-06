import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Svg, { Circle } from 'react-native-svg';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { getTimeZoneFromStore } from '../../../shared/stores/time-zone.store';

type Day = {
  label: string;
  date: string;
  name: string;
  startTime: string;
  isToday: boolean;
  completed: boolean;
  isScheduled: boolean;
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
      {props.hasSchedule || props.weekDays.length > 0 ? <ScheduledOverview {...props} styles={styles} /> : <SchedulePrompt {...props} styles={styles} />}
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
  const plannedDays = weekDays.filter((day) => day.isScheduled);
  const extraDays = weekDays.filter((day) => !day.isScheduled && day.completed);
  const scheduledCompleted = plannedDays.filter((day) => day.completed).length;
  const weeklyTarget = plannedDays.length;
  const progress = weeklyTarget > 0 ? Math.min(completedThisWeek / weeklyTarget, 1) : 0;
  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>This week</Text>
        <Pressable accessibilityRole="button" onPress={onManage} hitSlop={10}>
          <Text style={[styles.link, { color: theme.primary }]}>Manage</Text>
        </Pressable>
      </View>
      <Text style={[styles.scopeText, { color: theme.textSecondary }]}>{weeklyTarget ? 'Every workout counts toward your weekly goal.' : 'Every workout counts. Set a schedule to add a weekly goal.'}</Text>
      <View style={styles.summary}>
        <View style={styles.weeklySummary}>
          {weeklyTarget > 0 ? <View accessible accessibilityRole="progressbar" accessibilityLabel="Weekly workout goal" accessibilityValue={{ min: 0, max: weeklyTarget, now: Math.min(completedThisWeek, weeklyTarget), text: `${completedThisWeek} of ${weeklyTarget} workouts completed` }}>
            <Svg width={64} height={64}>
              <Circle cx={32} cy={32} r={29} fill="none" stroke={theme.surfaceMuted} strokeWidth={4} />
              {progress > 0 ? <Circle cx={32} cy={32} r={29} fill="none" stroke={theme.primary} strokeWidth={4} strokeDasharray={`${2 * Math.PI * 29} ${2 * Math.PI * 29}`} strokeDashoffset={2 * Math.PI * 29 * (1 - progress)} strokeLinecap="round" rotation={-90} origin="32, 32" /> : null}
            </Svg>
          </View> : null}
          <View style={styles.weeklyCopy}>
            <Text style={[styles.summaryValue, { color: theme.textPrimary }]}>
              {weeklyTarget > 0 && completedThisWeek <= weeklyTarget ? `${completedThisWeek} of ${weeklyTarget} workouts` : `${completedThisWeek} workout${completedThisWeek === 1 ? '' : 's'}`}
            </Text>
            <Text style={[styles.caption, { color: theme.textSecondary }]}>{scheduledCompleted} scheduled · {extraDays.length} extra</Text>
            {weeklyTarget > 0 && completedThisWeek >= weeklyTarget ? <Text style={[styles.goalMessage, { color: theme.profit }]}>{completedThisWeek > weeklyTarget ? 'Weekly goal exceeded' : 'Weekly goal reached'}</Text> : null}
          </View>
        </View>
      </View>
      <WeekStrip weekDays={weekDays} theme={theme} styles={styles} />
    </>
  );
};

const WeekStrip = ({ weekDays, theme, styles }: { weekDays: Day[]; theme: AppThemeColors; styles: Styles }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const assignedWorkout = weekDays.find((day) => day.date === selectedDate && day.isScheduled);
  const today = DateTime.now().setZone(getTimeZoneFromStore()).startOf('day');
  const sunday = today.minus({ days: today.weekday % 7 });
  return (
    <>
      <View style={styles.weekStrip}>
        {Array.from({ length: 7 }, (_, index) => {
          const date = sunday.plus({ days: index });
          const workouts = weekDays.filter((day) => day.date === date.toISODate());
          const planned = workouts.some((day) => day.isScheduled);
          const completed = workouts.some((day) => day.completed);
          const isToday = date.hasSame(today, 'day');
          const selected = selectedDate === date.toISODate();
          return <Pressable key={date.toISODate()} accessibilityRole="button" accessibilityState={{ selected }} accessibilityHint="Show assigned workout" onPress={() => setSelectedDate(selected ? null : date.toISODate())} accessibilityLabel={`${date.toFormat('cccc, MMMM d')}${isToday ? ', today' : ''}, ${planned ? 'workout planned' : 'no workout planned'}, ${completed ? 'workout completed' : 'no workout completed'}`} style={({ pressed }) => [styles.weekDay, pressed && styles.pressed]}>
            <Text style={[styles.weekDayLabel, { color: isToday ? theme.primary : theme.textSecondary }]}>{date.toFormat('ccc')}</Text>
            <View style={[styles.dayNumber, { backgroundColor: selected ? theme.primary : isToday ? theme.primarySoft : 'transparent' }]}>
              <Text style={[styles.dayNumberText, { color: selected ? theme.white : isToday ? theme.primary : theme.textPrimary }]}>{date.day}</Text>
            </View>
            <View style={styles.dayMarkers}>
              {completed ? <MaterialCommunityIcons name="check" size={18} color={theme.profit} /> : planned ? <View style={[styles.plannedDot, { backgroundColor: theme.primary }]} /> : null}
            </View>
          </Pressable>;
        })}
      </View>
      {selectedDate ? <View accessibilityLiveRegion="polite" style={[styles.dayDetail, { borderTopColor: theme.border }]}>
        <Text style={[styles.caption, { color: theme.textSecondary }]}>{DateTime.fromISO(selectedDate).toFormat('cccc, d MMM')}</Text>
        <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>{assignedWorkout?.name ?? 'No workout scheduled'}</Text>
        {assignedWorkout ? <Text style={[styles.caption, { color: theme.textSecondary }]}>{assignedWorkout.completed ? 'Completed' : assignedWorkout.startTime || 'Any time'}</Text> : null}
      </View> : null}
    </>
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
    summaryValue: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body, fontVariant: ['tabular-nums'] },
    caption: { marginTop: 1, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
    weekStrip: { marginTop: 20, flexDirection: 'row' },
    weekDay: { flex: 1, minWidth: 0, alignItems: 'center', gap: 4 },
    weekDayLabel: { fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
    dayNumber: { minHeight: 32, minWidth: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    dayNumberText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall, fontVariant: ['tabular-nums'] },
    dayMarkers: { height: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
    plannedDot: { width: 5, height: 5, borderRadius: 3 },
    dayDetail: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 12, gap: 4 },
    goalMessage: { marginTop: 8, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
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
