/* eslint-disable @typescript-eslint/no-require-imports */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Column from '../../../shared/components/Column';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';
import { HomeDashboardData } from '../types/use-home-page.types';

type Props = {
  data: HomeDashboardData['nextWorkout'];
  theme: AppThemeColors;
  isFirstWorkout: boolean;
  onStart: () => void;
};

const NextWorkoutCard = ({ data, theme, isFirstWorkout, onStart }: Props) => {
  const common = createSharedComponentStyles(theme);

  return (
    <View style={[styles.hero, { backgroundColor: theme.heroSurface }]}>
      <Image
        source={require('../../../assets/home-workout-hero.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="center"
      />
      <Column style={[styles.overlay, { backgroundColor: theme.heroOverlay }]}>
        <Text style={styles.eyebrow}>{isFirstWorkout ? 'YOUR FIRST WORKOUT' : "TODAY'S WORKOUT"}</Text>
        <Text style={styles.title}>{data.muscleGroup}</Text>
        <Text style={styles.meta}>
          Split A · {data.exerciseCount} exercises · {data.setCount} sets
        </Text>
        <TouchableOpacity style={[common.primaryButton, styles.button]} onPress={onStart} activeOpacity={0.85}>
          <Text style={common.primaryButtonText}>{isFirstWorkout ? 'Start first workout' : 'Start workout'}</Text>
          <MaterialCommunityIcons name="chevron-right" size={RFValue(24)} color={theme.white} />
        </TouchableOpacity>
      </Column>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: { borderRadius: 20, overflow: 'hidden' },
  overlay: { padding: 22, paddingVertical: 30 },
  eyebrow: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label, letterSpacing: 0.6, color: '#FFFFFF' },
  title: { marginTop: 15, fontFamily: fontFamilies.semiBold, fontSize: fontSizes.metric, color: '#FFFFFF' },
  meta: { marginTop: 10, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, color: '#FFFFFF' },
  button: { marginTop: 30 },
});

export default NextWorkoutCard;
