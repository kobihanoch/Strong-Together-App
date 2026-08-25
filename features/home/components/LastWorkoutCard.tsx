import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { AppThemeColors } from '../../../shared/constants/theme';
import { HomeDashboardData } from '../types/use-home-page.types';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';

const LastWorkoutCard = ({ data, theme, onPress }: { data: HomeDashboardData['lastWorkout']; theme: AppThemeColors; onPress: () => void }) => {
  const common = createSharedComponentStyles(theme);
  return <TouchableOpacity style={common.card} onPress={onPress} activeOpacity={0.8}>
    <Text style={common.cardTitle}>LAST WORKOUT</Text>
    <View style={common.detailRow}>
      <MaterialCommunityIcons name="dumbbell" size={RFValue(25)} color={theme.textPrimary} />
      <View style={common.detailCopy}>
        <Text style={common.detailTitle}>{data.name}  ·  {data.dateLabel}</Text>
        <Text style={common.detailMeta}>{data.exerciseCount} exercises  ·  {data.setCount} sets</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={RFValue(25)} color={theme.textSecondary} />
    </View>
  </TouchableOpacity>;
};

export default LastWorkoutCard;
