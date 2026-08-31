import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { AppThemeColors } from '../../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../../shared/constants/typography';
import EditorPressable from './EditorPressable';

type Props = {
  horizontalPadding: number;
  bottomInset: number;
  isCreateMode: boolean;
  isSaving: boolean;
  theme: AppThemeColors;
  onAdd: () => void;
  onSave: () => void;
};

const PlanEditorActions = ({ horizontalPadding, bottomInset, isCreateMode, isSaving, theme, onAdd, onSave }: Props) => (
  <View style={[styles.container, { paddingHorizontal: horizontalPadding, paddingBottom: Math.max(bottomInset, 8), borderTopColor: theme.border, backgroundColor: theme.canvas }]}>
    <EditorPressable onPress={onAdd} style={[styles.addButton, { borderColor: theme.primary }]}>
      <MaterialCommunityIcons name="plus" size={fontSizes.title} color={theme.primary} />
      <Text style={[styles.addText, { color: theme.primary }]}>Add exercise</Text>
    </EditorPressable>
    <EditorPressable onPress={onSave} disabled={isSaving} style={[styles.saveButton, { backgroundColor: theme.primary }]}>
      {isSaving ? <ActivityIndicator color={theme.white} /> : <Text style={styles.saveText}>{isCreateMode ? 'Create plan' : 'Save changes'}</Text>}
    </EditorPressable>
  </View>
);

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 100, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10, gap: 8 },
  addButton: { height: 44, borderWidth: 1, borderStyle: 'dashed', borderRadius: 14, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  addText: { fontFamily: fontFamilies.medium, fontSize: fontSizes.bodySmall },
  saveButton: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#FFF', fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
});

export default PlanEditorActions;
