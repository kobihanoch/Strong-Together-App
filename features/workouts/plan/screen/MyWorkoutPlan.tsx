import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import NoWorkoutPlan from '../components/NoWorkoutPlan';
import useMyWorkoutPlan from '../hooks/use-my-workout-plan.hook';

const MyWorkoutPlan = () => {
  const { data, actions } = useMyWorkoutPlan();
  const { width, height } = useWindowDimensions();
  const gutter = Math.max(16, Math.min(width * 0.045, 22));
  const heroHeight = Math.max(190, Math.min(height * 0.25, 230));

  if (data.isLoading)
    return (
      <View style={[styles.center, { backgroundColor: data.theme.canvas }]}>
        <ActivityIndicator color={data.theme.primary} />
      </View>
    );
  if (!data.hasWorkoutPlan) return <NoWorkoutPlan onCreatePress={actions.createPlan} />;
  const split = data.selectedSplit;
  if (!split) return null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: data.theme.canvas }]} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: gutter, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.eyebrow, { color: data.theme.textSecondary }]}>YOUR TRAINING</Text>
            <Text style={[styles.title, { color: data.theme.textPrimary }]}>Workout Plan</Text>
          </View>
          <MaterialCommunityIcons name="dots-vertical" size={fontSizes.title} color={data.theme.textPrimary} />
        </View>

        <View style={[styles.hero, { height: heroHeight, backgroundColor: data.theme.heroSurface }]}>
          {/* eslint-disable-next-line @typescript-eslint/no-require-imports */}
          <Image source={require('../../../../assets/workoutplanbg.png')} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: data.theme.heroOverlay }]} />
          <View style={styles.heroContent}>
            <Text numberOfLines={1} style={styles.heroTitle}>
              {split.name}
            </Text>
            <Text numberOfLines={1} style={styles.heroMeta}>
              {data.muscles.join(' · ') || split.muscleGroup || 'Workout split'}
            </Text>
            <Text style={styles.heroMeta}>
              {split.exercises.length} exercises · {data.setCount} sets
            </Text>
            <Pressable
              disabled={data.hasTrainedToday}
              onPress={actions.startWorkout}
              style={[styles.primaryButton, { backgroundColor: data.theme.primary, opacity: data.hasTrainedToday ? 0.55 : 1 }]}
            >
              <Text style={styles.primaryButtonText}>{data.hasTrainedToday ? 'Workout completed today' : `Start ${split.name}`}</Text>
            </Pressable>
          </View>
        </View>

        <FlatList
          horizontal
          data={data.workoutSplits}
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
          renderItem={({ item }) => {
            const active = item.id === split.id;
            return (
              <Pressable onPress={() => actions.selectSplit(item)} style={[styles.tab, active && { backgroundColor: data.theme.primary }]}>
                <Text numberOfLines={1} style={[styles.tabText, { color: active ? data.theme.white : data.theme.textPrimary }]}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: data.theme.textPrimary }]}>{split.name} exercises</Text>
          <Pressable onPress={actions.editPlan}>
            <Text style={[styles.editText, { color: data.theme.primary }]}>Edit plan</Text>
          </Pressable>
        </View>

        <View style={[styles.exerciseGroup, { borderColor: data.theme.border }]}>
          {split.exercises.map((exercise, index) => (
            <View
              key={exercise.exerciseToSplitId}
              style={[styles.exerciseRow, index > 0 && { borderTopColor: data.theme.border, borderTopWidth: StyleSheet.hairlineWidth }]}
            >
              <Text style={[styles.order, { color: data.theme.textPrimary }]}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.exerciseCopy}>
                <Text numberOfLines={1} style={[styles.exerciseName, { color: data.theme.textPrimary }]}>
                  {exercise.name}
                </Text>
                <Text numberOfLines={1} style={[styles.exerciseMuscle, { color: data.theme.textSecondary }]}>
                  {exercise.targetMuscle}
                </Text>
              </View>
              <View style={styles.exerciseValues}>
                <Text style={[styles.setCount, { color: data.theme.textSecondary }]}>{exercise.sets.length} sets</Text>
                <Text numberOfLines={1} style={[styles.reps, { color: data.theme.textSecondary }]}>
                  {exercise.sets.map((set) => set.reps).join(' · ')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, paddingBottom: 16 },
  eyebrow: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 1.4 },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, marginTop: 4 },
  hero: { overflow: 'hidden', borderRadius: 28 },
  heroContent: { flex: 1, padding: 20, justifyContent: 'flex-end', gap: 7 },
  heroTitle: { color: '#FFFFFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, maxWidth: '75%' },
  heroMeta: { color: 'rgba(255,255,255,0.82)', fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  primaryButton: { minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryButtonText: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  tabs: { gap: 8, paddingVertical: 16 },
  tab: { minWidth: 82, maxWidth: 126, paddingHorizontal: 18, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sectionTitle: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.title },
  editText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  exerciseGroup: { borderWidth: 1, borderRadius: 20, overflow: 'hidden' },
  exerciseRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  order: { width: 40, fontFamily: fontFamilies.medium, fontSize: fontSizes.title },
  exerciseCopy: { flex: 1, paddingRight: 8 },
  exerciseName: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  exerciseMuscle: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label, marginTop: 3 },
  exerciseValues: { alignItems: 'flex-end', maxWidth: '30%' },
  setCount: { fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
  reps: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label, marginTop: 3 },
});

export default MyWorkoutPlan;
