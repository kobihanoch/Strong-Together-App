import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import EditorPressable from './EditorPressable';

type Props = {
  horizontalPadding: number;
  bottomInset: number;
  theme: AppThemeColors;
  onAdd: () => void;
};

const PlanEditorActions = ({ horizontalPadding, bottomInset, theme, onAdd }: Props) => (
  <View
    style={[
      styles.container,
      {
        paddingHorizontal: horizontalPadding,
        paddingBottom: Math.max(bottomInset, 8),
        borderTopColor: theme.border,
        backgroundColor: theme.canvas,
      },
    ]}
  >
    <EditorPressable onPress={onAdd} style={[styles.addButton, { backgroundColor: theme.primary }]}>
      <MaterialCommunityIcons name="plus" size={fontSizes.title} color={theme.white} />
      <Text style={[styles.addText, { color: theme.white }]}>Add exercise</Text>
    </EditorPressable>
  </View>
);

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 100, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10 },
  addButton: { height: 52, borderRadius: 16, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center' },
  addText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
});

export default PlanEditorActions;
