/* eslint-disable @typescript-eslint/no-require-imports */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AppThemeColors, darkThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type Workout = {
  id: number;
  name: string;
  exerciseCount: number;
  setCount: number;
  estimatedDurationMinutes?: number | null;
  durationMinutes?: number;
};
type Props = {
  state: 'today' | 'up-next' | 'completed' | 'next-workout';
  workout: Workout;
  scheduleLabel: string;
  upNext: string;
  theme: AppThemeColors;
  onStart: () => void;
  onManageSchedule: () => void;
  onViewPlan: () => void;
  onViewSummary: () => void;
};

const AdaptiveWorkoutCard = ({ state, workout, scheduleLabel, theme: appTheme, onStart, onManageSchedule, onViewPlan, onViewSummary }: Props) => {
  const theme: AppThemeColors = { ...darkThemeColors, primary: appTheme.primary, surface: appTheme.heroSurface, heroSurface: appTheme.heroSurface };
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const completed = state === 'completed';
  const upcoming = state === 'up-next';
  const unscheduled = state === 'next-workout';
  const duration = completed ? workout.durationMinutes : workout.estimatedDurationMinutes;
  const meta = `${workout.exerciseCount} exercises · ${workout.setCount} sets${duration ? ` · ${completed ? '' : '~'}${Math.round(duration)} min` : ''}`;
  const [scheduleDay = '', scheduleTime = ''] = scheduleLabel.split(' · ');

  return (
    <View style={[styles.hero, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      {state === 'today' ? <View style={[styles.stateRail, { backgroundColor: theme.primary }]} /> : null}
      <View style={styles.copy}>
        {state === 'today' ? (
          <Text style={[styles.context, { color: theme.primary }]}>● {scheduleLabel || 'TODAY'}</Text>
        ) : upcoming ? (
          <View>
            <Text style={[styles.futureDay, { color: theme.textPrimary }]}>{scheduleDay.toUpperCase()}</Text>
            {scheduleTime ? <Text style={[styles.futureTime, { color: theme.textSecondary }]}>{scheduleTime}</Text> : null}
          </View>
        ) : completed ? (
          <View style={styles.completeRow}>
            <MaterialCommunityIcons name="check-circle" size={styles.completeIcon.width} color={theme.primary} />
            <Text style={[styles.completeMessage, { color: theme.textPrimary }]}>You’re done for today</Text>
          </View>
        ) : (
          <Text style={[styles.unscheduledMessage, { color: theme.textPrimary }]}>No workout scheduled</Text>
        )}
        <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={2}>
          {workout.name}
        </Text>
        {unscheduled ? <Text style={[styles.planContext, { color: theme.textSecondary }]}>is next in your plan</Text> : null}
        <Text style={[styles.meta, { color: theme.textSecondary }]}>{meta}</Text>
      </View>
      <View style={styles.actions}>
          {state === 'today' ? (
            <>
              <PrimaryButton label="Start workout" theme={theme} onPress={onStart} styles={styles} />
              <OutlineButton label="Reschedule" theme={theme} onPress={onManageSchedule} styles={styles} />
            </>
          ) : upcoming ? (
            <>
              <OutlineButton label="View workout" theme={theme} onPress={onViewPlan} styles={styles} />
              <PrimaryButton label="Start early" theme={theme} onPress={onStart} styles={styles} />
            </>
          ) : completed ? (
            <OutlineButton label="View summary" theme={theme} onPress={onViewSummary} styles={styles} />
          ) : (
            <PrimaryButton label="Start workout" theme={theme} onPress={onStart} styles={styles} />
          )}
      </View>
      <View style={[styles.imageMask, { backgroundColor: theme.heroSurface }]} pointerEvents="none">
        <Image source={require('../../../assets/home-workout-hero.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
        {completed ? <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.surface, opacity: 0.28 }]} /> : null}
      </View>
    </View>
  );
};

type Styles = ReturnType<typeof createStyles>;
const PrimaryButton = ({
  label,
  theme,
  onPress,
  styles,
}: {
  label: string;
  theme: AppThemeColors;
  onPress: () => void;
  styles: Styles;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.primaryButton, { backgroundColor: theme.primary }, pressed && styles.pressed]}
  >
    <MaterialCommunityIcons name="play" size={18} color={theme.white} />
    <Text style={[styles.primaryText, { color: theme.white }]}>{label}</Text>
  </Pressable>
);
const OutlineButton = ({
  label,
  theme,
  onPress,
  styles,
}: {
  label: string;
  theme: AppThemeColors;
  onPress: () => void;
  styles: Styles;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.outlineButton, { borderColor: theme.textSecondary }, pressed && styles.pressed]}
  >
    <Text style={[styles.outlineText, { color: theme.textPrimary }]}>{label}</Text>
  </Pressable>
);
const createStyles = (width: number, height: number) => {
  const padding = Math.max(18, Math.min(width * 0.055, 24));
  const imageWidth = Math.max(100, Math.min(width * 0.30, 140));
  const buttonHeight = Math.max(46, Math.min(height * 0.06, 52));
  return StyleSheet.create({
    hero: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 22,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 9,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    stateRail: { position: 'absolute', zIndex: 4, left: 0, top: 0, bottom: 0, width: Math.max(4, Math.min(width * 0.012, 6)) },
    copy: { zIndex: 3, padding, paddingRight: imageWidth + 14 },
    context: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 0.7, textTransform: 'uppercase' },
    futureDay: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall, letterSpacing: 1.2 },
    futureTime: { marginTop: 4, fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
    completeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    completeIcon: { width: Math.max(20, Math.min(width * 0.06, 24)) },
    completeMessage: { flexShrink: 1, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    unscheduledMessage: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall, lineHeight: fontSizes.title },
    title: {
      marginTop: Math.max(10, Math.min(height * 0.014, 14)),
      maxWidth: '92%',
      fontFamily: fontFamilies.bold,
      fontSize: fontSizes.hero,
    },
    planContext: { marginTop: 1, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
    meta: {
      marginTop: Math.max(8, Math.min(height * 0.012, 11)),
      maxWidth: '94%',
      fontFamily: fontFamilies.regular,
      fontSize: fontSizes.label,
      lineHeight: fontSizes.title,
    },
    actions: {
      zIndex: 3,
      paddingHorizontal: padding,
      paddingBottom: padding,
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: Math.max(10, width * 0.03),
    },
    primaryButton: {
      minHeight: buttonHeight,
      paddingHorizontal: Math.max(14, width * 0.04),
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
    },
    primaryText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    outlineButton: {
      minHeight: buttonHeight,
      paddingHorizontal: Math.max(14, width * 0.04),
      borderRadius: 15,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outlineText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    imageMask: {
      position: 'absolute',
      zIndex: 2,
      right: -1,
      top: -1,
      height: 150,
      width: imageWidth,
      overflow: 'hidden',
      borderTopLeftRadius: imageWidth * 0.72,
      borderBottomLeftRadius: imageWidth * 0.72,
    },
    pressed: { opacity: 0.78 },
  });
};
export default AdaptiveWorkoutCard;
