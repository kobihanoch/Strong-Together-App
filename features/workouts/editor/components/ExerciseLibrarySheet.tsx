import type { ReplaceWorkoutPlanBody } from '@strong-together/shared';
import React, { RefObject } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Skeleton } from 'moti/skeleton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SlidingBottomModal, { SlidingBottomModalRef } from '../../../../shared/components/SlidingBottomModal';
import type { AppThemeColors, AppThemeMode } from '../../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import { Exercise } from '../../plan/types/workout-plan.types';

type Props = {
  modalRef: RefObject<SlidingBottomModalRef | null>;
  height: number;
  split: ReplaceWorkoutPlanBody['workoutData'][number];
  exercises: Exercise[];
  isLoading: boolean;
  muscles: string[];
  selectedMuscle: string;
  query: string;
  theme: AppThemeColors;
  themeMode: AppThemeMode;
  onQuery: (value: string) => void;
  onMuscle: (value: string) => void;
  onAdd: (exercise: Exercise) => void;
};

const ExerciseLibrarySheet = ({
  modalRef,
  height,
  split,
  exercises,
  isLoading,
  muscles,
  selectedMuscle,
  query,
  theme,
  themeMode,
  onQuery,
  onMuscle,
  onAdd,
}: Props) => {
  const { width } = useWindowDimensions();
  const titleWidth = Math.max(120, Math.min(width * 0.4, 170));
  const subtitleWidth = Math.max(75, Math.min(width * 0.24, 105));

  return (
    <SlidingBottomModal ref={modalRef} title="" snapPoints={['55%', '78%', '92%']} flatListUsage={false}>
      <View style={[styles.content, { height: height * 0.72, backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Add Exercise</Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {split.name} · {split.exercises.length} of 10 exercises
        </Text>

        <View style={[styles.search, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="magnify" size={fontSizes.title} color={theme.textSecondary} />
          <TextInput
            value={query}
            onChangeText={onQuery}
            placeholder="Search exercises"
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
        </View>

        {!isLoading && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {muscles.map((muscle) => {
              const active = muscle === selectedMuscle;
              return (
                <Pressable
                  key={muscle}
                  onPress={() => onMuscle(muscle)}
                  style={[styles.filter, { backgroundColor: active ? theme.primary : theme.surfaceMuted }]}
                >
                  <Text style={[styles.filterText, { color: active ? theme.white : theme.textPrimary }]}>{muscle}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {isLoading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2, 3, 4].map((index) => (
              <View key={index} style={[styles.skeletonRow, { borderBottomColor: theme.border }]}>
                <Skeleton colorMode={themeMode} width={28} height={22} radius={6} />
                <View style={styles.skeletonCopy}>
                  <Skeleton colorMode={themeMode} width={titleWidth} height={14} radius={5} />
                  <Skeleton colorMode={themeMode} width={subtitleWidth} height={10} radius={4} />
                </View>
                <Skeleton colorMode={themeMode} width={34} height={14} radius={5} />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => {
              const added = split.exercises.some((exercise) => exercise.exerciseId === item.id);
              return (
                <Pressable disabled={added} onPress={() => onAdd(item)} style={[styles.row, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.order, { color: theme.textPrimary }]}>{String(index + 1).padStart(2, '0')}</Text>
                  <View style={styles.copy}>
                    <Text style={[styles.name, { color: theme.textPrimary }]}>{item.name}</Text>
                    <Text style={[styles.meta, { color: theme.textSecondary }]}>
                      {item.targetMuscle} · {item.specificTargetMuscle}
                    </Text>
                  </View>
                  {added ? (
                    <Animated.View entering={FadeIn.duration(110)} style={[styles.added, { borderColor: theme.profit }]}>
                      <MaterialCommunityIcons name="check" size={fontSizes.label} color={theme.profit} />
                      <Text style={[styles.addedText, { color: theme.profit }]}>Added</Text>
                    </Animated.View>
                  ) : (
                    <Text style={[styles.add, { color: theme.primary }]}>Add</Text>
                  )}
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </SlidingBottomModal>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingBottom: 20 },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  meta: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label, marginTop: 3 },
  search: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    marginTop: 16,
  },
  searchInput: { flex: 1, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  filters: { gap: 7, paddingVertical: 12 },
  filter: { paddingHorizontal: 14, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
  row: { minHeight: 66, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center' },
  order: { width: 38, fontFamily: fontFamilies.medium, fontSize: fontSizes.title },
  copy: { flex: 1, minWidth: 0 },
  name: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  add: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  added: { minHeight: 28, paddingHorizontal: 9, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  addedText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
  skeletonList: { flex: 1 },
  skeletonRow: { minHeight: 66, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 10 },
  skeletonCopy: { flex: 1, gap: 8 },
});

export default ExerciseLibrarySheet;
