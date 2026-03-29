import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../constants/colors';
import { ExerciseInPlan } from '../../types/dto/workoutPlans.dto';

type AnalyzeExerciseSheetProps = {
  selectedExercise: ExerciseInPlan | null;
};

const AnalyzeExerciseSheet = ({ selectedExercise }: AnalyzeExerciseSheetProps) => {
  if (!selectedExercise) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons name="brain" size={RFValue(24)} color={colors.primary} />
        <Text style={styles.title}>Choose an exercise to analyze</Text>
        <Text style={styles.subtitle}>Open the AI analysis action from an exercise card to get started.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconBadge}>
        <MaterialCommunityIcons name="brain" size={RFValue(22)} color={colors.primary} />
      </View>

      <Text style={styles.title}>{selectedExercise.exercise}</Text>
      <Text style={styles.subtitle}>AI movement analysis will be connected here in the next step.</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Target muscle</Text>
        <Text style={styles.infoValue}>{selectedExercise.targetmuscle ?? 'Unknown'}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Specific focus</Text>
        <Text style={styles.infoValue}>{selectedExercise.specifictargetmuscle ?? 'Not specified'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 14,
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(17),
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: RFValue(12),
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    borderRadius: 16,
    backgroundColor: colors.lightCardBg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 4,
  },
  infoLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: RFValue(11),
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: RFValue(13),
    color: colors.textPrimary,
  },
});

export default AnalyzeExerciseSheet;
