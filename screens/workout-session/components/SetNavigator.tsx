import type { CreateWorkoutSessionBody } from '@strong-together/shared';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type TrackedSet = CreateWorkoutSessionBody['workout'][number]['trackedSets'][number];

type Props = {
  theme: AppThemeColors;
  sets: TrackedSet[];
  activeIndex: number;
  completedSetKeys: string[];
  exerciseKey: string;
  plannedSetCount: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
};

const SetNavigator = ({ theme, sets, activeIndex, completedSetKeys, exerciseKey, plannedSetCount, onSelect, onAdd }: Props) => {
  const { width } = useWindowDimensions();
  const itemWidth = Math.max(48, Math.min(64, (width - 92) / Math.min(sets.length + 1, 5)));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {sets.map((set, index) => {
          const completed = completedSetKeys.includes(`${exerciseKey}:${set.setIndex}`);
          const active = index === activeIndex;
          const isExtra = index >= plannedSetCount;
          const isUnlocked = sets.slice(0, index).every((previousSet) => previousSet.weight > 0 && previousSet.reps > 0);

          return (
            <View key={set.setIndex} style={[styles.set, { width: itemWidth, opacity: isUnlocked ? 1 : 0.35 }]}>
              {isExtra && (
                <Text style={[styles.extra, { color: theme.achievement }]}>EXTRA</Text>
              )}
              <Pressable disabled={!isUnlocked} onPress={() => onSelect(index)} style={({ pressed }) => [styles.status, pressed && styles.pressed]}>
                {completed && <Text style={[styles.check, { color: theme.profit }]}>✓</Text>}
                {active && !completed && <View style={[styles.activeDot, { backgroundColor: theme.primary }]} />}
                <Text style={[styles.number, { color: active ? theme.primary : theme.textPrimary }]}>{index + 1}</Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />
      <Pressable accessibilityLabel="Add set" onPress={onAdd} style={({ pressed }) => [styles.add, pressed && styles.pressed]}>
        <Text style={[styles.addText, { color: theme.textPrimary }]}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 58, flexDirection: 'row', alignItems: 'stretch' },
  scroll: { flex: 1 },
  row: { alignItems: 'stretch' },
  set: { alignItems: 'center', justifyContent: 'center' },
  status: { width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  number: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  check: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  activeDot: { width: 14, height: 14, borderRadius: 7 },
  extra: { position: 'absolute', top: 2, fontFamily: fontFamilies.semiBold, fontSize: 7, letterSpacing: 0.5 },
  divider: { width: StyleSheet.hairlineWidth },
  add: { width: 56, alignItems: 'center', justifyContent: 'center' },
  addText: { fontFamily: fontFamilies.regular, fontSize: 32, lineHeight: 34 },
  pressed: { opacity: 0.65, transform: [{ scale: 0.94 }] },
});

export default SetNavigator;
