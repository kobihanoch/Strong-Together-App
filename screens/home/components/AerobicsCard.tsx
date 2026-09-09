import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import { formatTime } from '../../../shared/utils/shared-utils';
import { HomeDashboardData } from '../types/use-home-page.types';

const AerobicsCard = ({ data, theme, onLog }: { data: HomeDashboardData['aerobics']; theme: AppThemeColors; onLog: () => void }) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);
  const maxMinutes = Math.max(...data.days.map((day) => day.minutes), 1);
  const maxBarHeight = Math.max(36, Math.min(height * 0.055, 48));
  const time = formatTime(data.totalDurationMins, data.totalDurationSecs);
  const total = time.hours > 0 ? `${time.hours} hr ${time.minutes} min this week` : `${time.minutes} min${time.seconds ? ` ${time.seconds} sec` : ''} this week`;

  return <View style={[styles.section, { borderTopColor: theme.border }]}> 
    <View style={styles.header}><View><Text style={[styles.title, { color: theme.textPrimary }]}>Cardio</Text><Text style={[styles.total, { color: theme.textSecondary }]}>{total}</Text></View><Pressable onPress={onLog} hitSlop={10}><Text style={[styles.log, { color: theme.primary }]}>+ Log</Text></Pressable></View>
    <View style={[styles.chart, { borderBottomColor: theme.border }]}>{data.days.map((day, index) => <View key={`${day.label}-${index}`} style={styles.day}><View style={styles.barArea}><View testID={`aerobics-bar-${index}`} style={[styles.bar, { backgroundColor: day.minutes ? theme.primary : theme.border, height: day.minutes ? Math.max(4, (day.minutes / maxMinutes) * maxBarHeight) : 2 }]} /></View><Text style={[styles.dayLabel, { color: theme.textSecondary }]}>{day.label}</Text></View>)}</View>
  </View>;
};

const createStyles = (width: number, height: number) => {
  const chartHeight = Math.max(54, Math.min(height * 0.075, 66));
  const barHeight = chartHeight - 18;
  return StyleSheet.create({
    section: { paddingTop: Math.max(20, Math.min(height * 0.03, 28)), borderTopWidth: StyleSheet.hairlineWidth },
    header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }, title: { fontFamily: fontFamilies.bold, fontSize: fontSizes.title }, total: { marginTop: 3, fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall }, log: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
    chart: { height: chartHeight, marginTop: Math.max(10, Math.min(height * 0.016, 14)), flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth },
    day: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' }, barArea: { height: barHeight, width: Math.max(12, Math.min(width * 0.045, 18)), justifyContent: 'flex-end' }, bar: { width: Math.max(7, Math.min(width * 0.025, 10)), alignSelf: 'center', borderRadius: 2 }, dayLabel: { marginTop: 6, fontFamily: fontFamilies.regular, fontSize: fontSizes.label },
  });
};
export default AerobicsCard;
