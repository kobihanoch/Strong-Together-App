import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';
import useTrackHistory from '../hooks/use-track-history.hook';

type Data = ReturnType<typeof useTrackHistory>['data'];

const HistoryWeekStrip = ({ data, onSelect }: { data: Data; onSelect: (date: string) => void }) => {
  const { height } = useWindowDimensions();
  const selected = DateTime.fromISO(data.selectedDate);
  // Luxon weeks start on Monday; shift back to Sunday.
  const weekStart = selected.minus({ days: selected.weekday % 7 }).startOf('day');
  const days = Array.from({ length: 7 }, (_, index) => weekStart.plus({ days: index }));
  const canGoBack = weekStart.minus({ weeks: 1 }).endOf('week').toISODate()! >= data.minDate;
  const canGoForward = weekStart.plus({ weeks: 1 }).startOf('week').toISODate()! <= data.today;
  const moveWeek = (amount: number) => {
    const next = selected.plus({ weeks: amount });
    const bounded = next.toISODate()! < data.minDate ? data.minDate : next.toISODate()! > data.today ? data.today : next.toISODate()!;
    onSelect(bounded);
  };

  return (
    <View style={[styles.wrap, { marginTop: height * 0.025, borderBottomColor: data.theme.border }]}>
      <View style={styles.rangeRow}>
        <Pressable disabled={!canGoBack} onPress={() => moveWeek(-1)} hitSlop={12}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={data.theme.textPrimary} style={{ opacity: canGoBack ? 1 : 0.25 }} />
        </Pressable>
        <Text style={[styles.range, { color: data.theme.textPrimary }]}>
          {weekStart.toFormat('MMM d')} — {weekStart.plus({ days: 6 }).toFormat('MMM d')}
        </Text>
        <Pressable disabled={!canGoForward} onPress={() => moveWeek(1)} hitSlop={12}>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={data.theme.textPrimary}
            style={{ opacity: canGoForward ? 1 : 0.25 }}
          />
        </Pressable>
      </View>
      <View style={styles.days}>
        {days.map((day) => {
          const date = day.toISODate()!;
          const active = date === data.selectedDate;
          const disabled = date < data.minDate || date > data.today;
          return (
            <Pressable key={date} disabled={disabled} onPress={() => onSelect(date)} style={[styles.day, { opacity: disabled ? 0.25 : 1 }]}>
              <Text style={[styles.weekday, { color: data.theme.textSecondary }]}>{day.toFormat('ccc').slice(0, 1)}</Text>
              <View style={[styles.numberCircle, active && { backgroundColor: data.theme.primary }]}>
                <Text style={[styles.number, { color: active ? data.theme.white : data.theme.textPrimary }]}>{day.day}</Text>
              </View>
              <View style={[styles.dot, data.workoutDates.has(date) && { backgroundColor: data.theme.primary }]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: 1, paddingBottom: 14 },
  rangeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  range: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  days: { flexDirection: 'row', marginTop: 16 },
  day: { flex: 1, alignItems: 'center', gap: 4 },
  weekday: { fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
  numberCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  number: { fontFamily: fontFamilies.medium, fontSize: fontSizes.body },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'transparent' },
});

export default HistoryWeekStrip;
