import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { RefObject, useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import SlidingBottomModal, { SlidingBottomModalRef } from '../../../shared/components/SlidingBottomModal';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import type { NavigatorExercise } from '../utils/workout-session-screen.utils';

type Props = {
  modalRef: RefObject<SlidingBottomModalRef | null>;
  theme: AppThemeColors;
  exercises: NavigatorExercise[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onAddExercise: () => void;
};

const ExerciseNavigatorSheet = ({ modalRef, theme, exercises, activeIndex, onSelect, onReorder, onAddExercise }: Props) => {
  const { height, width } = useWindowDimensions();
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(0);

  const renderExerciseRow = useCallback(
    (item: NavigatorExercise, index: number, isActive = false, drag?: () => void) => {
      const isCurrent = index === activeIndex;
      const isComplete = item.totalSets > 0 && item.completedSets === item.totalSets;

      return (
        <Pressable
          disabled={isEditingOrder}
          onPress={() => {
            onSelect(index);
            modalRef.current?.close();
          }}
          style={[
            styles.row,
            { borderBottomColor: theme.border, backgroundColor: isCurrent || isActive ? theme.primarySoft : theme.surface },
          ]}
        >
          <Text style={[styles.status, { color: isComplete ? theme.profit : isCurrent ? theme.primary : theme.textSecondary }]}>
            {isComplete ? '✓' : isCurrent ? '●' : String(index + 1).padStart(2, '0')}
          </Text>
          <View style={styles.copy}>
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={[styles.name, { color: theme.textPrimary }]}>
                {item.name}
              </Text>
              {item.isAdded && <Text style={[styles.added, { color: theme.achievement }]}>ADDED</Text>}
            </View>
            <Text style={[styles.progress, { color: theme.textSecondary }]}>
              {item.completedSets}/{item.totalSets} sets
            </Text>
          </View>
          {isEditingOrder ? (
            <Pressable accessibilityLabel={`Reorder ${item.name}`} onLongPress={drag} onPressIn={drag} hitSlop={10}>
              <MaterialCommunityIcons name="drag-vertical" size={24} color={theme.textSecondary} />
            </Pressable>
          ) : (
            <MaterialCommunityIcons name="chevron-right" size={22} color={theme.textSecondary} />
          )}
        </Pressable>
      );
    },
    [activeIndex, isEditingOrder, modalRef, onSelect, theme],
  );

  const renderDraggableExercise = useCallback(
    ({ item, getIndex, drag, isActive }: RenderItemParams<NavigatorExercise>) => (
      <ScaleDecorator activeScale={0.98}>{renderExerciseRow(item, getIndex() ?? 0, isActive, drag)}</ScaleDecorator>
    ),
    [renderExerciseRow],
  );

  return (
    <SlidingBottomModal
      ref={modalRef}
      title=""
      snapPoints={['50%', '82%']}
      flatListUsage={false}
      onChange={(index) => index >= 0 && setSheetIndex(index)}
    >
      <View
        style={[
          styles.content,
          {
            height: height * (sheetIndex === 1 ? 0.72 : 0.4),
            paddingHorizontal: Math.max(16, width * 0.045),
          },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Exercises</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Jump anywhere in your workout</Text>
          </View>
          <Pressable onPress={() => setIsEditingOrder((value) => !value)} style={styles.editButton}>
            <Text style={[styles.editText, { color: theme.primary }]}>{isEditingOrder ? 'Done' : 'Edit order'}</Text>
          </Pressable>
        </View>

        <View style={[styles.listArea, { height: Math.max(120, height * (sheetIndex === 1 ? 0.72 : 0.4) - 126) }]}>
          {isEditingOrder ? (
            <DraggableFlatList
              data={exercises}
              keyExtractor={(item) => item.key}
              renderItem={renderDraggableExercise}
              onDragEnd={({ from, to }) => onReorder(from, to)}
              activationDistance={8}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          ) : (
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.key}
              renderItem={({ item, index }) => renderExerciseRow(item, index)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          )}
        </View>
        {!isEditingOrder && (
          <Pressable onPress={onAddExercise} style={[styles.addButton, { backgroundColor: theme.primary }]}>
            <MaterialCommunityIcons name="plus" size={20} color={theme.white} />
            <Text style={styles.addText}>Add exercise</Text>
          </Pressable>
        )}
      </View>
    </SlidingBottomModal>
  );
};

const styles = StyleSheet.create({
  // The list owns the remaining height; the CTA is a fixed sibling below it.
  content: { paddingBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14 },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  subtitle: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  editButton: { minHeight: 40, justifyContent: 'center', paddingLeft: 16 },
  editText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  listArea: { minHeight: 120 },
  list: { paddingBottom: 12 },
  row: { minHeight: 68, paddingHorizontal: 10, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center' },
  status: { width: 40, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  copy: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  name: { flexShrink: 1, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  added: { fontFamily: fontFamilies.bold, fontSize: fontSizes.caption },
  progress: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  addButton: {
    minHeight: 48,
    marginTop: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  addText: { color: '#FFFFFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
});

export default ExerciseNavigatorSheet;
