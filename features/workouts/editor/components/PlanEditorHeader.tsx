import type { ReplaceWorkoutPlanBody } from '@strong-together/shared';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { AppThemeColors } from '../../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import EditorPressable from './EditorPressable';

type Props = {
  splits: ReplaceWorkoutPlanBody['workoutData'];
  selectedIndex: number;
  isCreateMode: boolean;
  isDirty: boolean;
  isSaving: boolean;
  topInset: number;
  radius: number;
  theme: AppThemeColors;
  onCancel: () => void;
  onSave: () => void;
  onSelect: (index: number) => void;
  onRename: (name: string) => void;
  onAddSplit: () => void;
  onSplitOptions: () => void;
};

const PlanEditorHeader = ({
  splits,
  selectedIndex,
  isCreateMode,
  isDirty,
  isSaving,
  topInset,
  radius,
  theme,
  onCancel,
  onSave,
  onSelect,
  onRename,
  onAddSplit,
  onSplitOptions,
}: Props) => {
  const split = splits[selectedIndex];
  const { width } = useWindowDimensions();
  const tabWidth = Math.max(74, Math.min(width * 0.22, 106));
  if (!split) return null;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topInset + 12, borderBottomLeftRadius: radius, borderBottomRightRadius: radius, backgroundColor: theme.heroSurface },
      ]}
    >
      <View style={styles.topRow}>
        <Pressable onPress={onCancel}>
          <Text style={styles.action}>Cancel</Text>
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{isCreateMode ? 'Create Plan' : 'Edit Plan'}</Text>
          {isDirty && <Text style={styles.unsaved}>Unsaved</Text>}
        </View>
        <Pressable onPress={onSave} disabled={isSaving}>
          <Text style={[styles.action, { color: theme.primary }]}>{isSaving ? 'Saving' : 'Save'}</Text>
        </Pressable>
      </View>

      <View style={styles.nameRow}>
        <TextInput
          value={split.name}
          onChangeText={onRename}
          maxLength={32}
          selectTextOnFocus
          style={styles.nameInput}
          accessibilityLabel="Split name"
        />
        <MaterialCommunityIcons name="pencil-outline" size={fontSizes.title} color="rgba(255,255,255,0.72)" />
      </View>
      <Text style={styles.meta}>
        {split.exercises.length} exercises · {split.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)} sets
      </Text>

      <View style={styles.splitBar}>
        <View style={styles.splitViewport}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.splitContent}>
            {splits.map((item, index) => {
              const active = index === selectedIndex;
              return (
                <EditorPressable
                  key={item.id === undefined ? `new-${index}` : `id-${item.id}`}
                  onPress={() => onSelect(index)}
                  style={[styles.splitTab, { width: tabWidth }, active && { backgroundColor: theme.primary }]}
                >
                  <Text numberOfLines={1} style={[styles.splitText, { color: active ? theme.white : 'rgba(255,255,255,0.72)' }]}>
                    {item.name}
                  </Text>
                </EditorPressable>
              );
            })}
          </ScrollView>
        </View>
        <Pressable onPress={onAddSplit} style={styles.iconButton}>
          <MaterialCommunityIcons name="plus" size={fontSizes.title} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={onSplitOptions} style={styles.iconButton}>
          <MaterialCommunityIcons name="dots-horizontal" size={fontSizes.title} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18, paddingBottom: 18 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleBlock: { alignItems: 'center' },
  title: { color: '#FFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  action: { color: '#FFF', fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  unsaved: { color: 'rgba(255,255,255,0.55)', fontFamily: fontFamilies.regular, fontSize: fontSizes.caption, marginTop: 2 },
  label: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.caption,
    letterSpacing: 1.2,
    marginTop: 18,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 20 },
  nameInput: { color: '#FFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, paddingVertical: 4, flexShrink: 1, minWidth: 80 },
  meta: { color: 'rgba(255,255,255,0.65)', fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  splitBar: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 7, paddingBottom: 10 },
  splitViewport: { flex: 1, minWidth: 0, overflow: 'hidden' },
  splitContent: { gap: 4, paddingRight: 8 },
  splitTab: {
    height: 40,
    borderRadius: 13,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  iconButton: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlanEditorHeader;
