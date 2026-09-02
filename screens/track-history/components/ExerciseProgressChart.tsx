import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { getProgressChange, TrackHistoryPoint } from '../utils/track-history.utils';

const ExerciseProgressChart = ({ points, theme }: { points: TrackHistoryPoint[]; theme: AppThemeColors }) => {
  const { height } = useWindowDimensions();
  const [chartWidth, setChartWidth] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  if (!points.length) return null;
  const chartHeight = Math.max(72, Math.min(height * 0.1, 92));
  const edgePadding = 6;
  const plotWidth = Math.max(chartWidth - edgePadding * 2, 1);
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const xy = points.map((point, index) => ({
    x: points.length === 1 ? chartWidth / 2 : edgePadding + (index / (points.length - 1)) * plotWidth,
    y: chartHeight - ((point.value - min) / range) * (chartHeight - 12) - 6,
  }));
  const line = xy.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const area = points.length > 1 ? `${line} L ${chartWidth - edgePadding} ${chartHeight} L ${edgePadding} ${chartHeight} Z` : '';
  // Compare the oldest displayed workout with the newest one.
  const change = getProgressChange(points);
  const changeLabel = `${change > 0 ? '+' : ''}${change.toFixed(1)}% over the last ${points.length} workouts`;
  const measureChart = (event: LayoutChangeEvent) => setChartWidth(event.nativeEvent.layout.width);
  const selectedPoint = points.find((point) => point.date === selectedDate) ?? null;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textPrimary }]}>MAX WEIGHT PROGRESS</Text>
      <Text style={[styles.change, { color: change > 0 ? theme.profit : theme.textSecondary }]}>{changeLabel}</Text>
      <View style={styles.chartRow}>
        <View style={styles.axis}>
          <Text style={[styles.axisText, { color: theme.textSecondary }]}>{max} kg</Text>
          <Text style={[styles.axisText, { color: theme.textSecondary }]}>{min}</Text>
        </View>
        <View style={styles.plot} onLayout={measureChart}>
          {chartWidth > 0 && (
            <Svg width="100%" height={chartHeight}>
              <Line x1={edgePadding} x2={chartWidth - edgePadding} y1="6" y2="6" stroke={theme.border} />
              <Line x1={edgePadding} x2={chartWidth - edgePadding} y1={chartHeight - 1} y2={chartHeight - 1} stroke={theme.border} />
              {area ? <Path d={area} fill={theme.primarySoft} opacity={0.45} /> : null}
              <Path d={line} fill="none" stroke={theme.primary} strokeWidth={2} />
              {xy.map((point, index) => (
                <React.Fragment key={points[index].date}>
                  <Circle cx={point.x} cy={point.y} r={14} fill="transparent" onPress={() => setSelectedDate(points[index].date)} />
                  <Circle
                    cx={point.x}
                    cy={point.y}
                    r={selectedDate === points[index].date ? 4 : 3}
                    fill={selectedDate === points[index].date ? theme.primary : theme.surface}
                    stroke={theme.primary}
                    strokeWidth={2}
                    pointerEvents="none"
                  />
                </React.Fragment>
              ))}
            </Svg>
          )}
        </View>
      </View>
      <View style={styles.dateRow}>
        <View style={styles.axisSpacer} />
        <View style={styles.dates}>
          {points.map((point) => (
            <Text key={point.date} style={[styles.date, { color: theme.textSecondary }]}>
              {DateTime.fromISO(point.date).toFormat('MMM d')}
            </Text>
          ))}
        </View>
      </View>
      {selectedPoint && (
        <View style={[styles.pointDetails, { borderTopColor: theme.border }]}>
          <Text style={[styles.pointDate, { color: theme.textSecondary }]}>{DateTime.fromISO(selectedPoint.date).toFormat('MMM d')}</Text>
          <Text style={[styles.pointValue, { color: theme.textPrimary }]}>
            Set {selectedPoint.setNumber} · {selectedPoint.value} kg × {selectedPoint.reps}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginTop: 18 },
  label: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 2 },
  change: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall, marginTop: 5 },
  chartRow: { flexDirection: 'row', marginTop: 12 },
  axis: { width: 48, justifyContent: 'space-between' },
  plot: { flex: 1, overflow: 'visible' },
  axisText: { fontFamily: fontFamilies.regular, fontSize: fontSizes.caption },
  dateRow: { flexDirection: 'row', marginTop: 4 },
  axisSpacer: { width: 48 },
  dates: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  date: { fontFamily: fontFamilies.regular, fontSize: fontSizes.caption },
  pointDetails: { marginLeft: 48, marginTop: 10, paddingTop: 10, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between' },
  pointDate: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  pointValue: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
});

export default ExerciseProgressChart;
