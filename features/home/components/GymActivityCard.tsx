import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Column from '../../../shared/components/Column';
import Row from '../../../shared/components/Row';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';
import { HomeDashboardData } from '../types/use-home-page.types';

type Props = {
  data: HomeDashboardData['gymActivity'];
  theme: AppThemeColors;
};

const GymActivityCard = ({ data, theme }: Props) => {
  const common = createSharedComponentStyles(theme);
  const { width } = useWindowDimensions();
  const ringSize = Math.min(Math.max(width * 0.28, 104), 124);
  const strokeWidth = Math.min(Math.max(width * 0.018, 7), 9);
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = data.weeklyTarget > 0 ? Math.min(data.completedThisWeek / data.weeklyTarget, 1) : 0;
  const workoutsToGo = Math.max(data.weeklyTarget - data.completedThisWeek, 0);

  return (
    <View style={common.card}>
      <Text style={common.cardTitle}>THIS WEEK</Text>
      <Row style={styles.metrics}>
        <Column style={styles.metric}>
          <View style={{ width: ringSize, height: ringSize }}>
            <Svg width={ringSize} height={ringSize} style={styles.ring}>
              <Circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke={theme.achievementSoft} strokeWidth={strokeWidth} />
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke={theme.achievement}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={circumference * (1 - progress)}
                strokeLinecap="round"
              />
            </Svg>
            <Column style={styles.ringValue}>
              <Row style={styles.countRow}>
                <Text style={[styles.count, { color: theme.textPrimary }]}>{data.completedThisWeek}</Text>
                <Text style={[styles.ofTarget, { color: theme.textPrimary }]}>of {data.weeklyTarget}</Text>
              </Row>
              <Text style={[styles.label, { color: theme.textSecondary }]}>workouts</Text>
            </Column>
          </View>
        </Column>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <Column style={styles.metric}>
          <MaterialCommunityIcons name="fire" size={fontSizes.metric} color={theme.achievement} />
          <Text style={[styles.streakValue, { color: theme.textPrimary }]}>{data.weekStreak}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>week streak</Text>
        </Column>
      </Row>
      <Text style={[styles.remaining, { color: theme.textSecondary }]}>
        {workoutsToGo} {workoutsToGo === 1 ? 'workout' : 'workouts'} to go
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  metrics: { marginTop: 14, alignItems: 'center' },
  metric: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  divider: { width: 1, height: '68%' },
  ring: { transform: [{ rotate: '-90deg' }] },
  ringValue: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  countRow: { alignItems: 'baseline', gap: 4 },
  count: { fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
  ofTarget: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  streakValue: { marginTop: 4, fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
  label: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  remaining: { marginTop: 8, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, textAlign: 'center' },
});

export default GymActivityCard;
