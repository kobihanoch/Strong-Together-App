import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import type { MyWorkoutPlanReturn } from '../hooks/use-my-workout-plan.hook';

type PlanData = MyWorkoutPlanReturn['data'];
type Props = {
  theme: PlanData['theme'];
  splits: PlanData['workoutSplits'];
  selectedSplit: NonNullable<PlanData['selectedSplit']>;
  onSelect: MyWorkoutPlanReturn['actions']['selectSplit'];
};

const WorkoutSplitSelector = ({ theme, splits, selectedSplit, onSelect }: Props) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rail} contentContainerStyle={[styles.content, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      {splits.map((split, index) => {
        const active = split.id === selectedSplit.id;
        return (
          <Pressable key={split.id} onPress={() => onSelect(split)} style={({ pressed }) => [styles.tab, active && { backgroundColor: theme.primarySoft }, pressed && styles.pressed]}>
            <Text style={[styles.index, { color: active ? theme.primary : theme.textSecondary }]}>{String(index + 1).padStart(2, '0')}</Text>
            <Text numberOfLines={1} style={[styles.name, { color: active ? theme.primary : theme.textPrimary }]}>{split.name}</Text>
            {active && <View style={[styles.activeLine, { backgroundColor: theme.primary }]} />}
          </Pressable>
        );
      })}
      <View style={[styles.count, { borderLeftColor: theme.border }]}><Text style={[styles.countText, { color: theme.textSecondary }]}>{splits.length} splits</Text></View>
    </ScrollView>
  );
};

const createStyles = (width: number, height: number) => {
  const railHeight = Math.max(52, Math.min(height * 0.07, 60));
  return StyleSheet.create({
    rail: { marginTop: Math.max(12, Math.min(height * 0.02, 18)) },
    content: { minWidth: '100%', borderWidth: 1, borderRadius: Math.max(14, Math.min(width * 0.045, 18)), overflow: 'hidden' },
    tab: { minWidth: Math.max(96, width * 0.27), maxWidth: Math.max(132, width * 0.38), height: railHeight, paddingHorizontal: Math.max(12, width * 0.035), flexDirection: 'row', alignItems: 'center', gap: Math.max(6, width * 0.02) },
    index: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    name: { flexShrink: 1, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    activeLine: { position: 'absolute', left: 14, right: 14, bottom: 0, height: Math.max(2, height * 0.004), borderRadius: 2 },
    count: { height: railHeight, paddingHorizontal: Math.max(12, width * 0.035), borderLeftWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
    countText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
    pressed: { opacity: 0.72 },
  });
};

export default WorkoutSplitSelector;
