import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import type { MyWorkoutPlanReturn } from '../hooks/use-my-workout-plan.hook';

type Props = { theme: MyWorkoutPlanReturn['data']['theme'] };

const WorkoutPlanHeader = ({ theme }: Props) => {
  const { height } = useWindowDimensions();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(12, Math.min(height * 0.02, 18)) }]}>
      <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>YOUR TRAINING</Text>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Workout Plan</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  eyebrow: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 1.4 },
  title: { marginTop: 4, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
});

export default WorkoutPlanHeader;
