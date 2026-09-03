import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { EditableCardioRecord } from '../../../features/workouts/cardio/types/cardio.types';
import { AppThemeColors } from '../../../shared/constants/theme';
import { fontFamilies, fontSizes } from '../../../shared/constants/typography';

type Props = {
  records: EditableCardioRecord[];
  week: { label: string; minutes: number }[];
  theme: AppThemeColors;
  isDeleting: boolean;
  onEdit: (record: EditableCardioRecord) => void;
  onDelete: (id: number) => Promise<unknown>;
};

const CardioHistorySection = ({ records, week, theme, isDeleting, onEdit, onDelete }: Props) => {
  const [menuId, setMenuId] = useState<number | null>(null);

  const maxMinutes = Math.max(...week.map((day) => day.minutes), 1);
  const totalMinutes = week.reduce((total, day) => total + day.minutes, 0);

  if (!totalMinutes) return null;

  const confirmDelete = (record: EditableCardioRecord) => {
    Alert.alert('Delete cardio?', `Remove this ${record.type.toLowerCase()} from your history?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void onDelete(record.id) },
    ]);
  };

  return (
    <View style={styles.section}>
      <View style={styles.chartHeader}>
        <Text style={[styles.heading, { color: theme.textSecondary }]}>CARDIO THIS WEEK</Text>
        <Text style={[styles.total, { color: theme.textPrimary }]}>{totalMinutes} min</Text>
      </View>
      <View style={styles.chart}>
        {week.map((day, index) => (
          <View key={`${day.label}-${index}`} style={styles.day}>
            <View style={[styles.track, { backgroundColor: theme.primarySoft }]}>
              <View
                style={[
                  styles.bar,
                  {
                    height: day.minutes ? Math.max((day.minutes / maxMinutes) * 62, 4) : 0,
                    backgroundColor: theme.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.dayLabel, { color: theme.textSecondary }]}>{day.label}</Text>
          </View>
        ))}
      </View>
      {records.length ? <Text style={[styles.selectedDay, { color: theme.textSecondary }]}>SELECTED DAY</Text> : null}
      {records.map((record) => (
        <View key={record.id} style={[styles.row, { borderBottomColor: theme.border }]}>
          <View style={styles.details}>
            <Text style={[styles.name, { color: theme.textPrimary }]}>{record.type}</Text>
            <Text style={[styles.duration, { color: theme.textSecondary }]}>{record.durationMins} min</Text>
          </View>
          <Pressable hitSlop={10} onPress={() => setMenuId((current) => (current === record.id ? null : record.id))}>
            <MaterialCommunityIcons name="dots-horizontal" size={22} color={theme.textSecondary} />
          </Pressable>
          {menuId === record.id ? (
            <View style={styles.actions}>
              <Pressable onPress={() => { setMenuId(null); onEdit(record); }}>
                <Text style={[styles.action, { color: theme.primary }]}>Edit</Text>
              </Pressable>
              <Pressable disabled={isDeleting} onPress={() => { setMenuId(null); confirmDelete(record); }}>
                <Text style={[styles.action, { color: theme.textSecondary }]}>Delete</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 28 },
  heading: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 2, marginBottom: 6 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: { fontFamily: fontFamilies.bold, fontSize: fontSizes.body },
  chart: { height: 92, flexDirection: 'row', alignItems: 'flex-end', marginTop: 12, marginBottom: 18 },
  day: { flex: 1, alignItems: 'center', gap: 7 },
  track: { width: 22, height: 62, borderRadius: 7, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: 7 },
  dayLabel: { fontFamily: fontFamilies.medium, fontSize: fontSizes.label },
  selectedDay: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.caption, letterSpacing: 1.5, marginTop: 4 },
  row: { minHeight: 58, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center' },
  details: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  name: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.body },
  duration: { fontFamily: fontFamilies.regular, fontSize: fontSizes.bodySmall },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 18, marginLeft: 14 },
  action: { fontFamily: fontFamilies.semiBold, fontSize: fontSizes.bodySmall },
});

export default CardioHistorySection;
