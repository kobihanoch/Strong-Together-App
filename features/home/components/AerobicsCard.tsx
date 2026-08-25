import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Row from '../../../shared/components/Row';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { createSharedComponentStyles } from '../../../shared/styles/component.styles';
import { formatTime } from '../../../shared/utils/shared-utils';
import { HomeDashboardData } from '../types/use-home-page.types';

const AerobicsCard = ({ data, theme }: { data: HomeDashboardData['aerobics']; theme: AppThemeColors }) => {
  const common = createSharedComponentStyles(theme);
  const { width } = useWindowDimensions();
  const barHeight = Math.min(Math.max(width * 0.2, 64), 84);
  const barWidth = Math.min(Math.max(width * 0.07, 20), 30);
  const maxMinutes = Math.max(...data.days.map((day) => day.minutes), 1);

  const formattedAerobicsTime = formatTime(data.totalMinutes);
  const moreThanOneHour = formattedAerobicsTime.hours >= 1;
  return (
    <View style={common.card}>
      <Text style={common.cardTitle}>AEROBICS THIS WEEK</Text>
      <View style={[styles.chart, { height: barHeight + 28 }]}>
        {data.days.map((day, index) => (
          <View key={`${day.label}-${index}`} style={styles.day}>
            <View style={[styles.track, { width: barWidth, height: barHeight, backgroundColor: theme.primarySoft }]}>
              <View
                testID={`aerobics-bar-${index}`}
                style={[
                  styles.bar,
                  {
                    height: day.minutes === 0 ? 0 : Math.max((day.minutes / maxMinutes) * barHeight, 4),
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>{day.label}</Text>
          </View>
        ))}
      </View>
      <Row style={{ width: '100%', alignItems: 'baseline', marginTop: 20 }}>
        {moreThanOneHour ? (
          <>
            <Text style={[styles.total, { color: theme.primary }]}>{formattedAerobicsTime.hours}</Text>
            <Text style={[styles.unit, { color: theme.textPrimary }]}> hrs</Text>
            <Text style={[styles.total, { color: theme.primary, marginLeft: 10 }]}>{formattedAerobicsTime.minutes}</Text>
            <Text style={[styles.unit, { color: theme.textPrimary }]}> mins</Text>
          </>
        ) : (
          <>
            <Text style={[styles.total, { color: theme.primary }]}>
              {formattedAerobicsTime.minutes}
              <Text style={[styles.unit, { color: theme.textPrimary }]}> mins</Text>
            </Text>
            <Text style={[styles.total, { color: theme.primary, marginLeft: 10 }]}>
              {formattedAerobicsTime.seconds}
              <Text style={[styles.unit, { color: theme.textPrimary }]}> secs</Text>
            </Text>
          </>
        )}
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({
  chart: { height: 104, marginTop: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  day: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  track: { borderRadius: 9, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 9 },
  dayLabel: { fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  total: { fontFamily: fontFamilies.bold, fontSize: fontSizes.metric },
  unit: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
});

export default AerobicsCard;
