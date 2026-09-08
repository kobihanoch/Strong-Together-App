import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import type { MyWorkoutPlanReturn } from '../hooks/use-my-workout-plan-screen.hook';

type Props = {
  theme: MyWorkoutPlanReturn['data']['theme'];
  onSchedulePress: () => void;
};

const WorkoutPlanHeader = ({ theme, onSchedulePress }: Props) => {
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(12, Math.min(height * 0.02, 18)) }]}>
      <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>YOUR TRAINING</Text>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Workout Plan</Text>
        <Pressable hitSlop={10} onPress={onSchedulePress}>
          <Text style={[styles.schedule, { color: theme.primary }]}>Schedule</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  eyebrow: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 1.4 },
  title: { marginTop: 4, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  schedule: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
});

export default WorkoutPlanHeader;
