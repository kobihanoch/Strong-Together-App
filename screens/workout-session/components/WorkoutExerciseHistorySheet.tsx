import { DateTime } from 'luxon';
import React, { RefObject, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { ExerciseInExerciseHistory } from '../../../features/workouts/history/types/exercise-history.types';
import SlidingBottomModal, { SlidingBottomModalRef } from '../../../shared/components/SlidingBottomModal';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import ExerciseProgressChart from '../../track-history/components/ExerciseProgressChart';
import type { TrackHistoryPoint } from '../../track-history/utils/track-history.utils';

type Props = {
  modalRef: RefObject<SlidingBottomModalRef | null>;
  theme: AppThemeColors;
  exerciseName: string;
  history: ExerciseInExerciseHistory[];
  points: TrackHistoryPoint[];
  plannedSetCount: number;
  onFillValues: (sets: ExerciseInExerciseHistory['sets']) => void;
};

const WorkoutExerciseHistorySheet = ({ modalRef, theme, exerciseName, history, points, plannedSetCount, onFillValues }: Props) => {
  const { height, width } = useWindowDimensions();
  const [selected, setSelected] = useState<ExerciseInExerciseHistory | null>(history[0] ?? null);
  const selectedWorkout = selected ?? history[0] ?? null;

  useEffect(() => setSelected(history[0] ?? null), [history]);

  return (
    <SlidingBottomModal ref={modalRef} title="" snapPoints={['72%', '85%']} flatListUsage={false}>
      <ScrollView
        style={{ height: height * 0.82 }}
        contentContainerStyle={{ paddingHorizontal: Math.max(16, width * 0.05), paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.textPrimary }]}>{exerciseName}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Exercise history</Text>

        <ExerciseProgressChart
          points={points}
          theme={theme}
          onPointSelect={(point) => setSelected(history.find((entry) => entry.workoutStartLocal === point.date) ?? null)}
        />

        {selectedWorkout && (
          <View style={styles.workout}>
            <Text style={[styles.section, { color: theme.textPrimary }]}>
              WORKOUT · {DateTime.fromISO(selectedWorkout.workoutStartLocal).toFormat('MMM d')}
            </Text>
            {selectedWorkout.sets.map((set, index) => (
              <View key={`${set.setIndex}-${index}`} style={[styles.row, { borderBottomColor: theme.border }]}>
                <View style={styles.setLabel}>
                  <Text style={[styles.rowText, { color: theme.textSecondary }]}>Set {index + 1}</Text>
                  {set.setIndex >= plannedSetCount && (
                    <Text style={[styles.extra, { color: theme.primary, backgroundColor: theme.primarySoft }]}>EXTRA</Text>
                  )}
                </View>
                <Text style={[styles.rowValue, { color: theme.textPrimary }]}>
                  {set.weight} kg × {set.reps}
                </Text>
              </View>
            ))}
            <Pressable
              onPress={() => {
                onFillValues(selectedWorkout.sets);
                modalRef.current?.close();
              }}
              style={[styles.fill, { backgroundColor: theme.primary }]}
            >
              <Text style={styles.fillText}>Fill values</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SlidingBottomModal>
  );
};

const styles = StyleSheet.create({
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  subtitle: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  workout: { marginTop: 26 },
  section: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.5, marginBottom: 8 },
  row: {
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setLabel: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  rowText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  extra: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  rowValue: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  fill: { minHeight: 48, marginTop: 20, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  fillText: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
});

export default WorkoutExerciseHistorySheet;
