import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  workoutStartedAtUtc: string | null;
  previousSet: { weight: number; reps: number } | null;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onOpenNavigator: () => void;
  onFinish: () => void;
};

const WorkoutSessionHeader = ({
  theme,
  workoutName,
  exerciseName,
  setNumber,
  setCount,
  completedCount,
  totalSets,
  workoutStartedAtUtc,
  previousSet,
  onBack,
  onPrevious,
  onNext,
  onOpenNavigator,
  onFinish,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(14, Math.min(width * 0.045, 22));

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.heroSurface,
          height: Math.max(210, Math.min(height * 0.265, 232)),
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
        <Pressable accessibilityRole="button" onPress={onFinish} hitSlop={10}>
          <Text style={styles.finish}>Finish</Text>
        </Pressable>
      </View>

      <View style={styles.exerciseRow}>
        <Pressable accessibilityLabel="Previous exercise" onPress={onPrevious} style={styles.arrow}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.white} />
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onOpenNavigator} style={styles.exerciseTitle}>
          <Text numberOfLines={1} style={styles.name}>
            {exerciseName}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color={theme.white} />
        </Pressable>
        <Pressable accessibilityLabel="Next exercise" onPress={onNext} style={styles.arrow}>
          <MaterialCommunityIcons name="chevron-right" size={28} color={theme.white} />
        </Pressable>
      </View>

      <Text style={styles.position}>
        Set <Text style={{ color: theme.primary }}>{setNumber}</Text> of {setCount}
      </Text>
      <Text style={styles.previous}>
        {previousSet ? `Previous · ${previousSet.weight} kg × ${previousSet.reps} reps` : 'No previous performance'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: 8, paddingBottom: 34, overflow: 'hidden' },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  sideAction: { width: 52, height: 44, alignItems: 'flex-start', justifyContent: 'center' },
  workoutContext: { flex: 1, alignItems: 'center' },
  workoutTitle: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  timer: { color: '#B8AEA4', fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, marginTop: 2 },
  finish: { width: 52, color: '#FFFFFF', textAlign: 'right', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  exerciseTitle: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  name: { color: '#FFFFFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.title + 2, maxWidth: '88%' },
  position: { color: '#FFFFFF', textAlign: 'center', fontFamily: fontFamilies.medium, fontSize: fontSizes.body, marginTop: 4 },
  previous: { color: '#D3CCC5', textAlign: 'center', fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall, marginTop: 8 },
});

export default WorkoutSessionHeader;
