import type { AddWorkoutBody } from '@strong-together/shared';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Animated, { FadeIn } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { AppThemeColors } from '../../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import { Exercise } from '../../plan/types/workout-plan.types';

type ExerciseInput = AddWorkoutBody['workoutData'][number]['exercises'][number];

type Props = {
  exercises: ExerciseInput[];
  exercisesById: Map<number, Exercise>;
  expandedExerciseId: number | null;
  horizontalPadding: number;
  theme: AppThemeColors;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onReorder: (data: ExerciseInput[]) => void;
  onSetCount: (id: number, count: number) => void;
  onRep: (id: number, setIndex: number, reps: number) => void;
};

const PlanExerciseList = ({
  exercises,
  exercisesById,
  expandedExerciseId,
  horizontalPadding,
  theme,
  onToggle,
  onRemove,
  onReorder,
  onSetCount,
  onRep,
}: Props) => {
  const { height } = useWindowDimensions();
  const bottomSpace = Math.max(400, Math.min(height * 0.55, 520));
  const renderItem = useCallback(
    ({ item, getIndex, drag }: { item: ExerciseInput; getIndex: () => number | undefined; drag: () => void }) => {
      const metadata = exercisesById.get(item.exerciseId);
      const expanded = expandedExerciseId === item.exerciseId;
      const index = getIndex() ?? 0;

      return (
        <ScaleDecorator activeScale={0.99}>
          <View style={[styles.item, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <Pressable onLongPress={drag} delayLongPress={120} hitSlop={10}>
              <MaterialCommunityIcons name="drag-vertical" size={fontSizes.title} color={theme.textSecondary} />
            </Pressable>
            <Pressable style={styles.main} onPress={() => onToggle(item.exerciseId)}>
              <Text style={[styles.order, { color: theme.textPrimary }]}>{String(index + 1).padStart(2, '0')}</Text>
              <View style={styles.copy}>
                <Text numberOfLines={1} style={[styles.name, { color: theme.textPrimary }]}>
                  {metadata?.name ?? 'Exercise'}
                </Text>
                <Text numberOfLines={1} style={[styles.meta, { color: theme.textSecondary }]}>
                  {metadata?.targetMuscle ?? ''}
                </Text>
              </View>
              {!expanded && (
                <View style={styles.summary}>
                  <Text style={[styles.meta, { color: theme.textSecondary }]}>{item.sets.length} sets</Text>
                  <Text style={[styles.meta, { color: theme.textSecondary }]}>{item.sets.join(' / ')}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => onToggle(item.exerciseId)} hitSlop={10}>
              <MaterialCommunityIcons name="dots-horizontal" size={fontSizes.title} color={theme.textSecondary} />
            </Pressable>

            {expanded && (
              <Animated.View entering={FadeIn.duration(110)} style={[styles.editor, { borderTopColor: theme.border }]}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>SETS</Text>
                <View style={styles.optionRow}>
                  {[1, 2, 3, 4, 5].map((count) => {
                    const selected = count === item.sets.length;
                    return (
                      <Pressable
                        key={count}
                        onPress={() => onSetCount(item.exerciseId, count)}
                        style={[
                          styles.setOption,
                          { borderColor: theme.border },
                          selected && { backgroundColor: theme.primary, borderColor: theme.primary },
                        ]}
                      >
                        <Text style={[styles.optionText, { color: selected ? theme.white : theme.textPrimary }]}>{count}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={[styles.label, { color: theme.textSecondary }]}>REPS BY SET</Text>
                <View style={styles.repsRow}>
                  {item.sets.map((reps, setIndex) => (
                    <View key={setIndex} style={[styles.repField, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}>
                      <Text style={[styles.repLabel, { color: theme.textSecondary }]}>S{setIndex + 1}</Text>
                      <TextInput
                        value={String(reps)}
                        onChangeText={(value) => onRep(item.exerciseId, setIndex, Number(value.replace(/\D/g, '')) || 1)}
                        keyboardType="number-pad"
                        selectTextOnFocus
                        maxLength={3}
                        style={[styles.repInput, { color: theme.textPrimary }]}
                      />
                    </View>
                  ))}
                </View>
                <Pressable onPress={() => onRemove(item.exerciseId)} style={styles.removeButton}>
                  <MaterialCommunityIcons name="trash-can-outline" size={fontSizes.body} color={theme.textSecondary} />
                  <Text style={[styles.removeText, { color: theme.textSecondary }]}>Remove exercise</Text>
                </Pressable>
              </Animated.View>
            )}
          </View>
        </ScaleDecorator>
      );
    },
    [expandedExerciseId, exercisesById, onRemove, onRep, onSetCount, onToggle, theme],
  );

  return (
    <DraggableFlatList
      data={exercises}
      keyExtractor={(item) => String(item.exerciseId)}
      renderItem={renderItem}
      onDragEnd={({ data }) => onReorder(data)}
      contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: bottomSpace, gap: 8 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const styles = StyleSheet.create({
  item: { borderWidth: 1, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  order: { width: 42, fontFamily: fontFamilies.medium, fontSize: fontSizes.title },
  copy: { flex: 1, minWidth: 0 },
  name: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  meta: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label, marginTop: 3 },
  summary: { alignItems: 'flex-end', paddingHorizontal: 8 },
  editor: { width: '100%', borderTopWidth: StyleSheet.hairlineWidth, marginTop: 12, paddingTop: 12 },
  label: { fontFamily: fontFamilies.medium, fontSize: fontSizes.caption, letterSpacing: 1 },
  optionRow: { flexDirection: 'row', marginTop: 7, marginBottom: 12 },
  setOption: { flex: 1, height: 36, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 9, marginRight: 5 },
  optionText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  repsRow: { flexDirection: 'row', gap: 7, marginTop: 7, flexWrap: 'wrap' },
  repField: {
    minWidth: 84,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  repLabel: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  repInput: { flex: 1, textAlign: 'center', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall, paddingVertical: 0 },
  removeButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 40, marginTop: 10 },
  removeText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
});

export default PlanExerciseList;
