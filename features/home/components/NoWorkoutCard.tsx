import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Column from '../../../shared/components/Column';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';

const NoWorkoutCard = ({ theme, onCreate }: { theme: AppThemeColors; onCreate: () => void }) => {
  const common = createSharedComponentStyles(theme);
  return <Column style={[styles.container, { backgroundColor: theme.heroSurface }]}>
    <Text style={styles.eyebrow}>BUILD YOUR ROUTINE</Text>
    <Text style={styles.title}>Create your first workout</Text>
    <Text style={styles.copy}>Add your exercises, sets, and reps once. We’ll keep your next workout ready here.</Text>
    <TouchableOpacity style={[common.primaryButton, styles.button]} onPress={onCreate} activeOpacity={0.85}>
      <Text style={common.primaryButtonText}>Create workout</Text>
      <MaterialCommunityIcons name="arrow-right" size={RFValue(21)} color={theme.white} />
    </TouchableOpacity>
  </Column>;
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingVertical: 40, borderRadius: 20 },
  eyebrow: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.label, letterSpacing: 0.7, color: '#AFCBFF' },
  title: { marginTop: 8, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric, color: '#FFFFFF' },
  copy: {
    marginTop: 10,
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodySmall,
    lineHeight: RFValue(20),
    color: 'rgba(255,255,255,0.72)',
  },
  button: { marginTop: 24 },
});

export default NoWorkoutCard;
