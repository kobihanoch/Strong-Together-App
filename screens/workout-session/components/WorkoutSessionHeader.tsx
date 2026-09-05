import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import WorkoutElapsedTimer from './WorkoutElapsedTimer';

type Props = {
  theme: AppThemeColors;
  workoutName: string;
  exerciseName: string;
  setNumber: number;
  setCount: number;
  completedCount: number;
  totalSets: number;
  plannedCompletedSets: number;
  plannedTotalSets: number;
  workoutStartedAtUtc: string | null;
  previousSet: { weight: number; reps: number } | null;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onOpenNavigator: () => void;
  onFinish: () => void;
  isSaving: boolean;
};

const WorkoutSessionHeader = ({
  theme,
  workoutName,
  exerciseName,
  setNumber,
  setCount,
  completedCount,
  totalSets,
  plannedCompletedSets,
  plannedTotalSets,
  workoutStartedAtUtc,
  previousSet,
  onBack,
  onPrevious,
  onNext,
  onOpenNavigator,
  onFinish,
  isSaving,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(14, Math.min(width * 0.045, 22));
  const progress = plannedTotalSets ? Math.min(plannedCompletedSets / plannedTotalSets, 1) : 0;
  const progressPercentage = Math.round(progress * 100);
  const progressAnimation = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnimation, { toValue: progress, duration: 380, useNativeDriver: false }).start();
  }, [progress, progressAnimation]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.heroSurface,
          height: Math.max(278, Math.min(height * 0.35, 306)),
          paddingHorizontal: gutter,
          borderBottomLeftRadius: Math.max(24, Math.min(width * 0.075, 32)),
          borderBottomRightRadius: Math.max(24, Math.min(width * 0.075, 32)),
        },
      ]}
    >
      <View style={styles.topRow}>
        <Pressable accessibilityLabel="Leave workout screen" onPress={onBack} style={styles.sideAction}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.white} />
        </Pressable>
        <View style={styles.workoutContext}>
          <Text style={styles.workoutTitle}>
            {workoutName} · {completedCount}/{totalSets} sets
          </Text>
          <WorkoutElapsedTimer startedAtUtc={workoutStartedAtUtc} style={styles.timer} />
        </View>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: isSaving }} disabled={isSaving} onPress={onFinish} hitSlop={10} style={{ opacity: isSaving ? 0.55 : 1 }}>
          <Text style={styles.finish}>{isSaving ? 'Saving…' : 'Finish'}</Text>
        </Pressable>
      </View>

      <View style={styles.exerciseRow}>
        <Pressable accessibilityLabel="Previous exercise" onPress={onPrevious} style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.white} />
        </Pressable>
        <View style={styles.exerciseTitle}>
          <Text numberOfLines={1} style={styles.name}>
            {exerciseName}
          </Text>
        </View>
        <Pressable accessibilityLabel="Next exercise" onPress={onNext} style={({ pressed }) => [styles.arrow, pressed && styles.pressed]}>
          <MaterialCommunityIcons name="chevron-right" size={28} color={theme.white} />
        </Pressable>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Open exercise navigator" onPress={onOpenNavigator} style={({ pressed }) => [styles.navigatorAction, pressed && styles.pressed]}>
        <MaterialCommunityIcons name="format-list-bulleted" size={16} color={theme.primary} />
        <Text style={[styles.navigatorActionText, { color: theme.primary }]}>Manage exercises</Text>
        <MaterialCommunityIcons name="chevron-right" size={16} color={theme.primary} />
      </Pressable>
      <Text style={styles.position}>
        SET <Text style={[styles.positionNumber, { color: theme.primary }]}>{setNumber}</Text> / {setCount}
      </Text>
      <Text style={styles.previous}>
        {previousSet ? `Previous · ${previousSet.weight} kg × ${previousSet.reps} reps` : 'No previous performance'}
      </Text>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>WORKOUT PROGRESS</Text>
        <Text style={styles.progressValue}>{progressPercentage}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              backgroundColor: theme.primary,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 8, paddingBottom: 34, overflow: 'hidden' },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  sideAction: { width: 52, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  workoutContext: { flex: 1, alignItems: 'center' },
  workoutTitle: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall, letterSpacing: -0.2 },
  timer: { color: '#B8AEA4', fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, marginTop: 2 },
  finish: { width: 52, color: '#FFFFFF', textAlign: 'right', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', marginTop: 21 },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  exerciseTitle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  name: { color: '#FFFFFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.title + 4, letterSpacing: -0.6, maxWidth: '88%' },
  position: { color: '#D3CCC5', textAlign: 'center', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall, letterSpacing: 1, marginTop: 8 },
  positionNumber: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  navigatorAction: {
    alignSelf: 'center',
    minHeight: 32,
    marginTop: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navigatorActionText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
  previous: { color: '#D3CCC5', textAlign: 'center', fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, letterSpacing: -0.1, marginTop: 7 },
  progressHeader: { marginTop: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { color: '#9F9892', fontFamily: fontFamilies.semiBold, fontSize: 9, letterSpacing: 1.1 },
  progressValue: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption },
  progressTrack: { height: 3, marginTop: 5, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.16)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});

export default WorkoutSessionHeader;
