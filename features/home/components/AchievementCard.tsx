import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';
import { HomeDashboardData } from '../types/use-home-page.types';

const AchievementCard = ({
  data,
  theme,
  onPress,
}: {
  data: HomeDashboardData['achievement'];
  theme: AppThemeColors;
  onPress: () => void;
}) => {
  const common = createSharedComponentStyles(theme);
  return (
    <TouchableOpacity style={common.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={common.cardTitle}>LATEST PROGRESS</Text>
      <View style={common.detailRow}>
        <View style={[styles.icon, { backgroundColor: theme.heroSurface }]}>
          <MaterialCommunityIcons name="dumbbell" size={RFValue(23)} color={theme.white} />
        </View>
        <View style={common.detailCopy}>
          <Text style={common.detailTitle}>{data.exercise}</Text>
          <Text style={[styles.value, { color: theme.profit }]}>{data.value}</Text>
          <Text style={[styles.oneRepMax, { color: theme.textSecondary }]}>Est. 1RM · {data.estimatedOneRepMaxKg} kg</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={RFValue(25)} color={theme.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  value: { marginTop: 3, fontFamily: fontFamilies.bold, fontSize: fontSizes.title },
  oneRepMax: { marginTop: 2, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
});

export default AchievementCard;
