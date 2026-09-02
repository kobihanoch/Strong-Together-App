import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import useTrackHistory from '../hooks/use-track-history.hook';
import ExerciseProgressChart from './ExerciseProgressChart';

type Data = ReturnType<typeof useTrackHistory>['data'];
type Exercise = Data['exercises'][number];

const ExpandedExercise = ({ exercise, data }: { exercise: Exercise; data: Data }) => {
  const improvement = exercise.previousBest === null ? 0 : exercise.currentMax - exercise.previousBest;
  const percent = exercise.previousMax ? (improvement / exercise.previousMax) * 100 : 0;

  return (
    <View>
      <Text style={[styles.sectionLabel, { color: data.theme.textPrimary }]}>THIS WORKOUT</Text>
      <View style={styles.sets}>
        {exercise.sets.map((set, index) => (
          <View key={`${set.setIndex}-${index}`} style={[styles.setRow, { borderBottomColor: data.theme.border }]}>
            <View style={styles.setLabel}>
              <Text style={[styles.setText, { color: data.theme.textPrimary }]}>Set {index + 1}</Text>
              {set.isExtra && <Text style={[styles.extra, { color: data.theme.primary, backgroundColor: data.theme.primarySoft }]}>EXTRA</Text>}
            </View>
            <Text style={[styles.setText, { color: data.theme.textPrimary }]}>
              {set.weight} kg × {set.reps}
            </Text>
          </View>
        ))}
      </View>

      {exercise.isPr && (
        <View style={styles.achievement}>
          <MaterialCommunityIcons name="trophy-outline" size={26} color={data.theme.achievement} />
          <View style={styles.achievementText}>
            <Text style={[styles.achievementLabel, { color: data.theme.achievement }]}>ACHIEVEMENT</Text>
            <Text style={[styles.prTitle, { color: data.theme.textPrimary }]}>New personal record</Text>
            <Text style={[styles.secondary, { color: data.theme.textSecondary }]}>
              {exercise.currentMax} kg top set{improvement > 0 ? ` · +${improvement} kg from previous best` : ''}
            </Text>
          </View>
        </View>
      )}

      {exercise.previousMax !== null && (
        <View style={[styles.comparison, { borderBottomColor: data.theme.border }]}>
          <Text style={[styles.secondary, { color: data.theme.textSecondary }]}>
            Previous workout · {exercise.previousDate ? DateTime.fromISO(exercise.previousDate).toFormat('MMM d') : ''}
          </Text>
          <View style={styles.compareValues}>
            <Text style={[styles.compareText, { color: data.theme.textPrimary }]}>{exercise.previousMax} kg</Text>
            <MaterialCommunityIcons name="arrow-right" size={17} color={data.theme.primary} />
            <Text style={[styles.compareText, { color: data.theme.textPrimary }]}>{exercise.currentMax} kg</Text>
            {percent > 0 && <Text style={[styles.percent, { color: data.theme.profit }]}>+{percent.toFixed(1)}%</Text>}
          </View>
        </View>
      )}

      <ExerciseProgressChart points={exercise.progress} theme={data.theme} />
    </View>
  );
};

const ExerciseHistoryList = ({ data, onToggle }: { data: Data; onToggle: (id: number) => void }) => {
  const { height } = useWindowDimensions();
  if (!data.workout) return null;

  return (
    <View style={{ marginTop: height * 0.005 }}>
      <Text style={[styles.heading, { color: data.theme.textPrimary }]}>Workout details</Text>
      {data.exercises.map((exercise, index) => {
        const expanded = exercise.id === data.expandedId;
        return (
          <View key={exercise.id} style={[styles.exercise, { borderBottomColor: data.theme.border }]}>
            <Pressable onPress={() => onToggle(exercise.id)} style={styles.exerciseHeader}>
              <Text style={[styles.index, { color: data.theme.primary }]}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.identity}>
                <Text style={[styles.name, { color: data.theme.textPrimary }]}>{exercise.name}</Text>
                <View style={styles.metaRow}>
                  <Text style={[styles.secondary, { color: data.theme.textSecondary }]}>{exercise.muscle}</Text>
                  {exercise.addedDuringWorkout && (
                    <Text style={[styles.added, { color: data.theme.textSecondary }]}>ADDED DURING WORKOUT</Text>
                  )}
                </View>
              </View>
              <Text style={[styles.secondary, { color: data.theme.textSecondary }]}>{exercise.sets.length} sets</Text>
              <MaterialCommunityIcons name={expanded ? 'chevron-up' : 'chevron-down'} size={22} color={data.theme.textPrimary} />
            </Pressable>
            {expanded && <ExpandedExercise exercise={exercise} data={data} />}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title, marginBottom: 8 },
  exercise: { borderBottomWidth: 1, paddingVertical: 14 },
  exerciseHeader: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 12 },
  index: { width: 42, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
  identity: { flex: 1 },
  name: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  secondary: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  added: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, opacity: 0.7 },
  sectionLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 2, marginTop: 10 },
  sets: { marginTop: 8 },
  setRow: {
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  setText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  setLabel: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  extra: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 20, paddingHorizontal: 6 },
  achievementText: { flex: 1 },
  achievementLabel: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.5 },
  prTitle: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body, marginTop: 3 },
  comparison: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginTop: 12,
  },
  compareValues: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  compareText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  percent: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall, marginLeft: 3 },
});

export default ExerciseHistoryList;
