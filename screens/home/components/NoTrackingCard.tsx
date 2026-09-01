import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';

const NoTrackingCard = ({ theme }: { theme: AppThemeColors }) => {
  const common = createSharedComponentStyles(theme);
  return <View style={common.card}>
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: theme.primarySoft }]}><MaterialCommunityIcons name="chart-line" size={RFValue(22)} color={theme.primary} /></View>
      <View style={common.detailCopy}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Your progress starts here</Text>
        <Text style={[styles.copy, { color: theme.textSecondary }]}>Complete your first workout to unlock achievements and estimated 1RM insights.</Text>
      </View>
    </View>
  </View>;
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  copy: { marginTop: 4, fontFamily: fontFamilies.regular, fontSize: fontSizes.label, lineHeight: RFValue(17) },
});

export default NoTrackingCard;
