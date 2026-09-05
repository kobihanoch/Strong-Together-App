import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootParamList } from '../../navigation/types/appStackTypes';
import { fontFamilies, fontSizes } from '../../shared/constants/typography';
import CelebrationConfetti from './components/CelebrationConfetti';
import useWorkoutSummaryScreen from './hooks/use-workout-summary-screen.hook';

type Props = StackScreenProps<RootParamList, 'WorkoutSummary'>;

const WorkoutSummary = ({ route, navigation }: Props) => {
  const { data, actions } = useWorkoutSummaryScreen(route.params, navigation);
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(18, Math.min(width * 0.06, 28));
  const heroHeight = Math.max(225, Math.min(height * 0.34, 285));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: data.theme.heroSurface }]} edges={['top']}>
      <View style={[styles.hero, { height: heroHeight, paddingHorizontal: gutter }]}>
        <CelebrationConfetti />
        <View style={[styles.checkRing, { borderColor: data.theme.profit }]}>
          <View style={[styles.check, { backgroundColor: data.theme.profit }]}>
            <MaterialCommunityIcons name="check" size={30} color={data.theme.white} />
          </View>
        </View>
        <Text style={styles.eyebrow}>SESSION COMPLETE</Text>
        <Text style={styles.title}>Workout complete</Text>
        <Text style={styles.workoutName}>{data.workoutName}</Text>
      </View>

      <View
        style={[
          styles.surface,
          {
            backgroundColor: data.theme.canvas,
            paddingHorizontal: gutter,
            borderTopLeftRadius: Math.max(24, width * 0.075),
            borderTopRightRadius: Math.max(24, width * 0.075),
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.stats, { borderBottomColor: data.theme.border }]}>
            <Stat value={data.duration} label="DURATION" color={data.theme.textPrimary} secondary={data.theme.textSecondary} />
            <View style={[styles.statDivider, { backgroundColor: data.theme.border }]} />
            <Stat value={String(data.completedSets)} label="SETS" color={data.theme.textPrimary} secondary={data.theme.textSecondary} />
            <View style={[styles.statDivider, { backgroundColor: data.theme.border }]} />
            <Stat value={String(data.exerciseCount)} label="EXERCISES" color={data.theme.textPrimary} secondary={data.theme.textSecondary} />
          </View>

          {(data.prs.length > 0 || data.extraSets > 0) && (
            <View style={styles.achievements}>
              <Text style={[styles.sectionLabel, { color: data.theme.textSecondary }]}>TODAY’S HIGHLIGHTS</Text>
              {data.prs.map((pr) => (
                <View key={pr.exerciseId} style={[styles.row, { borderBottomColor: data.theme.border }]}>
                  <MaterialCommunityIcons name="trophy-outline" size={23} color={data.theme.achievement} />
                  <View style={styles.rowCopy}>
                    <Text style={[styles.rowTitle, { color: data.theme.textPrimary }]}>New personal record</Text>
                    <Text style={[styles.rowSubtitle, { color: data.theme.textSecondary }]}>{pr.name}</Text>
                  </View>
                  <Text style={[styles.rowValue, { color: data.theme.textPrimary }]}>{pr.weight} kg × {pr.reps}</Text>
                </View>
              ))}
              {data.extraSets > 0 && (
                <View style={[styles.row, { borderBottomColor: data.theme.border }]}>
                  <MaterialCommunityIcons name="star-four-points-outline" size={23} color={data.theme.primary} />
                  <View style={styles.rowCopy}>
                    <Text style={[styles.rowTitle, { color: data.theme.textPrimary }]}>{data.extraSets} extra {data.extraSets === 1 ? 'set' : 'sets'}</Text>
                    <Text style={[styles.rowSubtitle, { color: data.theme.textSecondary }]}>More work than planned</Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: Math.max(16, height * 0.025) }]}>
          <Pressable onPress={actions.viewWorkout} style={({ pressed }) => [styles.primary, { backgroundColor: data.theme.primary }, pressed && styles.pressed]}>
            <Text style={styles.primaryText}>View workout</Text>
            <MaterialCommunityIcons name="arrow-right" size={18} color={data.theme.white} />
          </Pressable>
          <Pressable onPress={actions.done} style={({ pressed }) => [styles.done, pressed && styles.pressed]}>
            <Text style={[styles.doneText, { color: data.theme.textSecondary }]}>Done</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Stat = ({ value, label, color, secondary }: { value: string; label: string; color: string; secondary: string }) => (
  <View style={styles.stat}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: secondary }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: { alignItems: 'center', justifyContent: 'center', paddingBottom: 20, overflow: 'hidden' },
  checkRing: { width: 68, height: 68, borderWidth: 1, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  check: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { marginTop: 14, color: '#AFA7A0', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.6 },
  title: { marginTop: 6, color: '#FFFFFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, letterSpacing: -0.7 },
  workoutName: { marginTop: 5, color: '#CFC8C1', fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  surface: { flex: 1, marginTop: -28, overflow: 'hidden' },
  content: { flexGrow: 1, paddingTop: 18, paddingBottom: 16 },
  stats: { minHeight: 92, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title + 2, letterSpacing: -0.4 },
  statLabel: { marginTop: 6, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 32 },
  achievements: { paddingTop: 24 },
  sectionLabel: { marginBottom: 5, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.4 },
  row: { minHeight: 72, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowCopy: { flex: 1 },
  rowTitle: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  rowSubtitle: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  rowValue: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
  actions: { paddingTop: 10, gap: 2 },
  primary: { minHeight: 52, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { color: '#FFFFFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.bodySmall },
  done: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  doneText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});

export default WorkoutSummary;
