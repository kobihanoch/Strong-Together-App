import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

const NoTrackingCard = ({ theme }: { theme: AppThemeColors }) => {
  const { height } = useWindowDimensions();
  return <View style={[styles.section, { paddingVertical: Math.max(18, Math.min(height * 0.027, 24)) }]}>
    <Text style={[styles.heading, { color: theme.textPrimary }]}>Latest progress</Text>
    <Text style={[styles.title, { color: theme.textPrimary }]}>Your progress starts here</Text>
    <Text style={[styles.copy, { color: theme.textSecondary }]}>Complete your first workout to unlock progress insights.</Text>
  </View>;
};

const styles = StyleSheet.create({
  section: {},
  heading: { fontFamily: fontFamilies.bold, fontSize: fontSizes.body },
  title: { marginTop: 9, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
  copy: { marginTop: 4, fontFamily: fontFamilies.regular, fontSize: fontSizes.label, lineHeight: RFValue(17) },
});

export default NoTrackingCard;
