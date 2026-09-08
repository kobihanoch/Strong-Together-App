import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type Props = {
  theme: AppThemeColors;
  workoutComplete: boolean;
  canAddExtraSet: boolean;
  onNext: () => void;
  onFinish: () => void;
  onAddSet: () => void;
};

const ExerciseCompletionActions = ({ theme, workoutComplete, canAddExtraSet, onNext, onFinish, onAddSet }: Props) => (
  <View style={styles.container}>
    <View style={styles.heading}>
      <MaterialCommunityIcons name="check-circle" size={20} color={theme.profit} />
      <Text style={[styles.title, { color: theme.textPrimary }]}>Exercise complete</Text>
    </View>
    <Pressable
      onPress={workoutComplete ? onFinish : onNext}
      style={({ pressed }) => [styles.primary, { backgroundColor: theme.primary }, pressed && styles.pressed]}
    >
      <Text style={styles.primaryText}>{workoutComplete ? 'Finish workout' : 'Next exercise'}</Text>
      <MaterialCommunityIcons name={workoutComplete ? 'flag-checkered' : 'arrow-right'} size={19} color={theme.white} />
    </Pressable>
    {canAddExtraSet && (
      <Pressable onPress={onAddSet} style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
        <MaterialCommunityIcons name="plus" size={17} color={theme.primary} />
        <Text style={[styles.secondaryText, { color: theme.primary }]}>Add extra set</Text>
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 18, alignItems: 'center' },
  heading: { marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 7 },
  title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.bodySmall },
  primary: { width: '100%', minHeight: 48, paddingHorizontal: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { color: '#FFFFFF', fontFamily: fontFamilies.bold, fontSize: fontSizes.bodySmall },
  secondary: { minHeight: 42, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  secondaryText: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});

export default ExerciseCompletionActions;
